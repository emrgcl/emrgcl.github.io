# Define input and output file paths
$inputFile = "input.xml"
$outputFile = "output.txt"

# Read content from the input XML file
$content = Get-Content -Path $inputFile -Raw

# Replace reserved characters with corresponding HTML entities
$content = $content.Replace('&', '&amp;')
$content = $content.Replace('<', '&lt;')
$content = $content.Replace('>', '&gt;')

# Save the modified content to the output file
Set-Content -Path $outputFile -Value $content
