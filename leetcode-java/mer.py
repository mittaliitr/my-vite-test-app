import json

# File paths
merged_file = 'merged.json'
problems_file = 'problems.json'

# Load data from both files
try:
    with open(merged_file, 'r') as file:
        merged_data = json.load(file)
except Exception as e:
    print(f"Error reading {merged_file}: {e}")
    merged_data = []

try:
    with open(problems_file, 'r') as file:
        problems_data = json.load(file)
except Exception as e:
    print(f"Error reading {problems_file}: {e}")
    problems_data = []

# Ensure both are lists
if not isinstance(merged_data, list):
    merged_data = [merged_data]
if not isinstance(problems_data, list):
    problems_data = [problems_data]

# Create a dictionary for quick lookup by title
merged_dict = {item['title']: item for item in merged_data}

# Merge the data
for problem in problems_data:
    title = problem.get('title')
    if title in merged_dict:
        # Merge common keys
        merged_dict[title].update(problem)
    else:
        # Add new entry
        merged_dict[title] = problem

# Convert back to a list
final_merged_data = list(merged_dict.values())

# Write the combined data back to merged.json
try:
    with open(merged_file, 'w') as file:
        json.dump(final_merged_data, file, indent=2)
    print(f"Successfully merged into {merged_file}")
except Exception as e:
    print(f"Error writing to {merged_file}: {e}")