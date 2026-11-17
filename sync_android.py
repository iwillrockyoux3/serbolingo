"""
SerboLingo Android Web Asset Sync Script
Copies all web assets into www/ and synchronizes them with Capacitor Android.
Usage: py sync_android.py
"""

import os
import shutil
import subprocess

def sync_assets():
    print("[SerboLingo] Syncing web assets to www/...")
    os.makedirs('www', exist_ok=True)
    exts = ('.html', '.js', '.css', '.json', '.svg', '.png', '.jpg', '.mp3', '.webmanifest')
    ignored_items = {'node_modules', 'android', 'www', '.git', '.antigravity', '.gemini', 'package.json', 'package-lock.json', 'capacitor.config.json'}

    copied = 0
    for item in os.listdir('.'):
        if item in ignored_items:
            continue
        if os.path.isfile(item) and item.endswith(exts):
            shutil.copy2(item, os.path.join('www', item))
            copied += 1
        elif os.path.isdir(item) and item in ('assets', 'audio', 'images', 'icons'):
            dest = os.path.join('www', item)
            if os.path.exists(dest):
                shutil.rmtree(dest)
            shutil.copytree(item, dest)
            copied += 1

    print(f"[SerboLingo] Successfully synced {copied} assets to www/.")
    
    # Run Capacitor sync
    node_path = r"C:\Program Files\nodejs"
    env = os.environ.copy()
    env["PATH"] = node_path + os.pathsep + env.get("PATH", "")
    npx_cmd = os.path.join(node_path, "npx.cmd")

    print("[SerboLingo] Running Capacitor sync for Android...")
    res = subprocess.run([npx_cmd, "cap", "sync", "android"], env=env, shell=True)
    if res.returncode == 0:
        print("[SerboLingo] Android sync completed successfully! Assets are ready in android/app/src/main/assets/public/")
    else:
        print("[SerboLingo] Capacitor sync failed with return code:", res.returncode)

if __name__ == '__main__':
    sync_assets()
