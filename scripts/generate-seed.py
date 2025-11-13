#!/usr/bin/env python3
import hashlib
import sys
import os

def read_file(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return f.read().strip()
    return ''

remote_file = 'remote_url.txt'
start_time_file = 'start_time.txt'

remote = read_file(remote_file)
if not remote or remote == 'no-remote':
    remote = 'local-development'

start_time = read_file(start_time_file)
if not start_time:
    print("Error: start_time.txt not found", file=sys.stderr)
    sys.exit(1)

first_commit_epoch = ''
try:
    result = os.popen('git log --reverse --format=%ct | head -n1').read().strip()
    if result:
        first_commit_epoch = result
    else:
        if os.path.exists('.git'):
            first_commit_epoch = str(int(os.path.getmtime('.git')))
        else:
            first_commit_epoch = '0'
except:
    first_commit_epoch = '0'

raw = f"{remote}|{first_commit_epoch}|{start_time}"
seed = hashlib.sha256(raw.encode()).hexdigest()[:12]

print(seed)

