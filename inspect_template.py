# -*- coding: utf-8 -*-
"""分析原始模板的样式结构"""
import zipfile, xml.etree.ElementTree as ET

docx_path = r'G:\MyAiProject\简历\李首男中文简历.docx'
ns = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture',
    'mc': 'http://schemas.openxmlformats.org/markup-compatibility/2006',
    'wps': 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape',
    'wpg': 'http://schemas.microsoft.com/office/word/2010/wordprocessingGroup',
}

with zipfile.ZipFile(docx_path) as z:
    # 列出所有文件
    print('=== ZIP contents ===')
    for n in z.namelist():
        print(' ', n)

    # 读取 styles.xml
    with z.open('word/styles.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()
        print('\n=== Style IDs ===')
        for style_elem in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}style'):
            sid = style_elem.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}styleId', '')
            name_el = style_elem.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}name')
            name = name_el.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val', '') if name_el is not None else ''
            if sid or name:
                print(f'  [{sid}] {name}')

    # 读取 document.xml
    with z.open('word/document.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()
        body = root.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}body')

        print('\n=== Document Structure (first 80 chars per paragraph) ===')
        for i, p in enumerate(body.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p')):
            pPr = p.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pPr')
            style = ''
            jc = ''
            if pPr is not None:
                pStyle = pPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pStyle')
                if pStyle is not None:
                    style = pStyle.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val', '')

            # 提取文本
            all_text = []
            for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                if t.text:
                    all_text.append(t.text)
            line = ''.join(all_text).strip()[:80]
            if line:
                print(f'  P{i:03d} [{style:>6s}] {line}')

        # 检查表格
        print('\n=== Tables ===')
        for ti, tbl in enumerate(body.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tbl')):
            print(f'  Table {ti}:')
            for ri, row in enumerate(tbl.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tr')):
                cells = []
                for cell in row.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tc'):
                    txt = []
                    for t in cell.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                        if t.text: txt.append(t.text)
                    cells.append(''.join(txt)[:40])
                if any(c.strip() for c in cells):
                    print(f'    Row {ri}: {" | ".join(cells)}')

        # 检查图片
        print('\n=== Images in document ===')
        for bi, blip in enumerate(body.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}blip')):
            embed = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed', '')
            print(f'  Blip {bi}: rId={embed}')

    # 读取 rels
    with z.open('word/_rels/document.xml.rels') as f:
        tree = ET.parse(f)
        root = tree.getroot()
        print('\n=== Relationships ===')
        for rel in root:
            rid = rel.get('Id', '')
            target = rel.get('Target', '')
            rtype = rel.get('Type', '').split('/')[-1]
            print(f'  {rid} -> {rtype}: {target}')
