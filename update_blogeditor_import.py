from pathlib import Path

path = Path(r"apps/web/app/admin/content/blog/BlogEditor.jsx")
text = path.read_text()

import_marker = "import { Card, Button, StatusBadge, LoadingSpinner, FormCheckbox, ConfirmDialog } from '../../components/ui';\n\n"
if import_marker not in text:
    import_marker = import_marker.replace('\n', '\r\n')

if import_marker not in text:
    raise SystemExit('UI import marker not found')

text = text.replace(import_marker, import_marker + "import ImageUploader from './ImageUploader';\n\n", 1)

path.write_text(text)
