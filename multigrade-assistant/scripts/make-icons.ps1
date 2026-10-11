Add-Type -AssemblyName System.Drawing

function Make-Icon($size, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#1e4d45'))
    $fgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#f2a900'))
    
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)
    
    $scale = $size / 512.0
    $g.FillRectangle($fgBrush, [int](96 * $scale), [int](300 * $scale), [int](80 * $scale), [int](116 * $scale))
    $g.FillRectangle($fgBrush, [int](216 * $scale), [int](220 * $scale), [int](80 * $scale), [int](196 * $scale))
    $g.FillRectangle($fgBrush, [int](336 * $scale), [int](140 * $scale), [int](80 * $scale), [int](276 * $scale))
    
    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created $outPath"
}

Make-Icon 192 "public\icon-192.png"
Make-Icon 512 "public\icon-512.png"
Make-Icon 512 "public\icon-maskable-512.png"
