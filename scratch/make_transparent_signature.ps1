Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\KRANTI\.gemini\antigravity-ide\brain\a9a0c864-cc31-4529-8f00-29c3523b914d\.user_uploaded\media_1791637601986.png"
$outputPath = "c:\Users\KRANTI\Downloads\arshithcamp-main\arshithcamp-main\public\ceo-signature.png"

$orig = [System.Drawing.Bitmap]::FromFile($inputPath)
$w = $orig.Width
$h = $orig.Height

Write-Output "Original dimensions: $w x $h"

# Find bounding box of signature (dark pixels)
$minX = $w
$maxX = 0
$minY = $h
$maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $orig.GetPixel($x, $y)
        # Check if pixel is dark (ink)
        if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Bounding box: X=[$minX, $maxX], Y=[$minY, $maxY]"

# Add padding
$pad = 12
$minX = [Math]::Max(0, $minX - $pad)
$minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($w - 1, $maxX + $pad)
$maxY = [Math]::Min($h - 1, $maxY + $pad)

$cropW = $maxX - $minX + 1
$cropH = $maxY - $minY + 1

Write-Output "Cropped dimensions: $cropW x $cropH"

$bmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $origC = $orig.GetPixel($minX + $x, $minY + $y)
        
        # Calculate ink darkness: 255 = black ink, 0 = pure white paper
        $avg = ($origC.R + $origC.G + $origC.B) / 3.0
        
        if ($avg -ge 245) {
            # Pure white -> transparent
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Ink pixel: convert darkness to alpha for crisp antialiasing
            $alpha = [int]([Math]::Min(255.0, [Math]::Max(0.0, (245.0 - $avg) / 245.0 * 255.0 * 1.5)))
            if ($alpha -gt 255) { $alpha = 255 }
            
            # Use deep dark slate / dark green tone matching brand #013323 or deep black #0b2219
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 1, 51, 35))
        }
    }
}

$orig.Dispose()

# Save as PNG
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "Successfully saved transparent cropped signature to $outputPath"
