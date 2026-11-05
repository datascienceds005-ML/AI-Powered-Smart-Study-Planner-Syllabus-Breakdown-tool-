"""Post-process the generated docx for WPS/Office compatibility:
1. Remove empty <w:pgNumType/> from document.xml (cover section artifact).
2. Patch footer PAGE fields with explicit format switches:
   - first footerReference in document order (front matter) -> PAGE \\* ROMAN \\* MERGEFORMAT
   - subsequent footerReference (body)                      -> PAGE \\* arabic \\* MERGEFORMAT
"""
import re
import shutil
import sys
import zipfile

src = sys.argv[1]
tmp = src + ".tmp"

with zipfile.ZipFile(src, "r") as zin:
    names = zin.namelist()
    data = {n: zin.read(n) for n in names}

doc_xml = data["word/document.xml"].decode("utf-8")

# 1. Remove empty pgNumType
doc_xml = doc_xml.replace("<w:pgNumType/>", "")

# 1b. De-duplicate TOC first entry: add_toc_placeholders.py may leave an inline
# hyperlink+PAGEREF entry inside the field paragraph alongside the plain
# placeholder entries, rendering the first heading twice. Keep plain entries only.
def _drop_inline_toc_hyperlink(xml):
    m = re.search(r'<w:hyperlink[^>]*w:anchor="_Toc\d+".*?</w:hyperlink>', xml, re.S)
    if m and "PAGEREF" in m.group(0):
        print("removed duplicate inline TOC hyperlink entry")
        return xml[:m.start()] + xml[m.end():]
    return xml

doc_xml = _drop_inline_toc_hyperlink(doc_xml)

# 2. Collect footerReference rIds in document order
rids = re.findall(r'<w:footerReference[^>]*r:id="([^"]+)"', doc_xml)
print("footerReference order:", rids)

rels_xml = data["word/_rels/document.xml.rels"].decode("utf-8")
rid_to_target = dict(re.findall(r'Id="([^"]+)"[^>]*Target="([^"]+)"', rels_xml))

fmt_for_index = {0: "ROMAN", 1: "arabic"}
patched = []
for idx, rid in enumerate(rids):
    target = rid_to_target.get(rid, "")
    if not target.startswith("footer"):
        continue
    fname = "word/" + target
    if fname not in data:
        continue
    fmt = fmt_for_index.get(idx, "arabic")
    xml = data[fname].decode("utf-8")
    new_xml, n = re.subn(
        r"(<w:instrText[^>]*>)\s*PAGE\s*(</w:instrText>)",
        r"\1 PAGE \\* " + fmt + r" \\* MERGEFORMAT \2",
        xml,
    )
    if n:
        data[fname] = new_xml.encode("utf-8")
        patched.append((fname, fmt, n))

data["word/document.xml"] = doc_xml.encode("utf-8")

with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
    for n in names:
        zout.writestr(n, data[n])

shutil.move(tmp, src)
print("patched footers:", patched)
print("pgNumType cleanup done")
