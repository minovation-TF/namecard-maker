"""Restore the complete gallery from the private GitHub source backup."""
from pathlib import Path
import hashlib,json,tempfile,zipfile,shutil,sys
root=Path(__file__).resolve().parents[1]
bundle=root/'asset-bundles'
manifest_file=bundle/'manifest.json'
if not manifest_file.is_file():
    if len(list((root/'public/assets/meritz').rglob('*.png')))==592:
        print('Gallery originals are already present; no bundle restoration needed.')
        sys.exit(0)
    raise SystemExit('Missing asset-bundles/manifest.json. Download the complete repository first.')
manifest=json.loads(manifest_file.read_text())
digest=hashlib.sha256()
with tempfile.TemporaryDirectory(prefix='namecard-assets-') as temporary:
    archive=Path(temporary)/'assets.zip'
    with archive.open('wb') as output:
        for part in manifest['parts']:
            name=part['name']
            if Path(name).name!=name:raise SystemExit('Invalid bundle part path.')
            data=(bundle/name).read_bytes()
            if len(data)!=part['bytes']or hashlib.sha256(data).hexdigest()!=part['sha256']:
                raise SystemExit('Bundle part is missing or damaged: '+name)
            digest.update(data);output.write(data)
    if digest.hexdigest()!=manifest['sha256']:raise SystemExit('Complete asset archive hash mismatch.')
    with zipfile.ZipFile(archive) as zipped:
        if zipped.testzip()is not None:raise SystemExit('Asset archive checksum failed.')
        if len(zipped.infolist())!=manifest['file_count']:raise SystemExit('Asset archive file count mismatch.')
        for info in zipped.infolist():
            path=Path(info.filename)
            if path.is_absolute()or '..'in path.parts or not info.filename.startswith('public/assets/'):
                raise SystemExit('Invalid asset path in archive.')
            destination=root/path
            if not destination.resolve().is_relative_to((root/'public/assets').resolve()):raise SystemExit('Asset path escapes the repository.')
            destination.parent.mkdir(parents=True,exist_ok=True)
            with zipped.open(info)as source,destination.open('wb')as target:shutil.copyfileobj(source,target)
print(f"Restored {manifest['file_count']} asset files.")
