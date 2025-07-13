import json
import re


def update_difficulty_from_readme(readme_path, json_path):
    # Read the README.md file
    with open(readme_path, 'r') as readme_file:
        readme_content = readme_file.read()
    # Extract problem names and difficulty levels using regex
    pattern = r"\|\s*\[(.*?)\]\(.*?\)\s*\|\s*\[.*?\]\(.*?\)\s*\|\s*(Easy|Medium|Hard)\s*\|"
    matches = re.findall(pattern, readme_content)

    # Create a dictionary of problem difficulties
    difficulty_map = {name: difficulty for name, difficulty in matches}
    print("Difficulty map created:", difficulty_map)
    # Load the problems.json file
    with open(json_path, 'r') as json_file:
        problems = json.load(json_file)
    # Update the difficulty levels in the JSON data
    for problem in problems:
        key = problem['number'] + ". " + problem['title']
        print("Generated key:", key)
        if key in difficulty_map:
            problem['difficulty'] = difficulty_map[key]
            print("Difficulty levels updated successfully.")

    # Write the updated JSON data back to the file
    with open(json_path, 'w') as json_file:
        json.dump(problems, json_file, indent=4)



# Paths to the files
readme_path = 'README.md'
json_path = 'problems.json'

# Update the difficulty levels
if __name__ == "__main__":
    # Paths to the files
    readme_path = 'README.md'
    json_path = 'problems.json'

    # Update the difficulty levels
    update_difficulty_from_readme(readme_path, json_path)