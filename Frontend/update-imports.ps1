$files = Get-ChildItem -Path src -Recurse -Include *.jsx

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Update imports for component files
    $content = $content -replace "import (.+?) from '(.+?)\/(.+?)'", "import `$1 from '`$2/`$3.jsx'"
    
    # Fix double extensions
    $content = $content -replace "\.jsx\.jsx", ".jsx"
    
    # Don't add .jsx to CSS imports
    $content = $content -replace "import '(.+?)\.jsx'", "import '`$1'"
    $content = $content -replace "import (.+?) from '(.+?)\.css\.jsx'", "import `$1 from '`$2.css'"
    
    # Don't add .jsx to non-component imports
    $content = $content -replace "import (.+?) from '@(.+?)\.jsx'", "import `$1 from '@`$2'"
    $content = $content -replace "import (.+?) from 'react(.+?)\.jsx'", "import `$1 from 'react`$2'"
    $content = $content -replace "import (.+?) from 'react-(.+?)\.jsx'", "import `$1 from 'react-`$2'"
    $content = $content -replace "import (.+?) from '@mui(.+?)\.jsx'", "import `$1 from '@mui`$2'"
    
    # Write the updated content back to the file
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Import statements updated successfully."
