#!/usr/bin/env python3
import os
import re

def make_url_safe(filename):
    """Convert filename to URL-safe version"""
    name, ext = os.path.splitext(filename)

    # Replace special characters
    replacements = {
        'ñ': 'n',
        'Ñ': 'N',
        'á': 'a',
        'à': 'a',
        'é': 'e',
        'è': 'e',
        'í': 'i',
        'ì': 'i',
        'ó': 'o',
        'ò': 'o',
        'ú': 'u',
        'ù': 'u',
        'ü': 'u',
        ' ': '-',
        ',': '',
        "'": '',
        '_': '-'
    }

    for old, new in replacements.items():
        name = name.replace(old, new)

    # Convert to lowercase and remove any remaining non-alphanumeric chars except hyphen
    name = re.sub(r'[^a-z0-9-]', '', name.lower())

    # Remove multiple consecutive hyphens
    name = re.sub(r'-+', '-', name)

    # Remove leading/trailing hyphens
    name = name.strip('-')

    return name + ext

# Dictionary to store old name -> new name mappings
mappings = {}

# Rename files in covers directory
covers_dir = 'covers'
if os.path.exists(covers_dir):
    print("Renaming cover files...")
    for filename in os.listdir(covers_dir):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            new_filename = make_url_safe(filename)
            if filename != new_filename:
                old_path = os.path.join(covers_dir, filename)
                new_path = os.path.join(covers_dir, new_filename)

                # Remove extension for mapping key
                old_key = os.path.splitext(filename)[0]
                new_key = os.path.splitext(new_filename)[0]
                mappings[old_key] = new_key

                print(f"  {filename} -> {new_filename}")
                os.rename(old_path, new_path)

# Rename files in spines directory
spines_dir = 'spines'
if os.path.exists(spines_dir):
    print("\nRenaming spine files...")
    for filename in os.listdir(spines_dir):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            new_filename = make_url_safe(filename)
            if filename != new_filename:
                old_path = os.path.join(spines_dir, filename)
                new_path = os.path.join(spines_dir, new_filename)
                print(f"  {filename} -> {new_filename}")
                os.rename(old_path, new_path)

# Print mappings for updating HTML and JSON
print("\nFile mappings (for updating HTML/JSON):")
print("-" * 50)
for old, new in sorted(mappings.items()):
    print(f"'{old}' -> '{new}'")