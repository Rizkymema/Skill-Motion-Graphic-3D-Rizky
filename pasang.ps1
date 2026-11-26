# Pasang motion-graphic-3d ke %USERPROFILE%\.claude\skills (dengan cadangan versi lama)
$ErrorActionPreference = 'Stop'
$akar = Split-Path -Parent $MyInvocation.MyCommand.Path
$skills = Join-Path $env:USERPROFILE '.claude\skills'
$tujuan = Join-Path $skills 'motion-graphic-3d'
$cadangan = Join-Path $env:USERPROFILE ('.claude\skills-cadangan\' + (Get-Date -Format 'yyyy-MM-dd HHmmss'))

New-Item -ItemType Directory -Force $skills | Out-Null
if (Test-Path $tujuan) {
    New-Item -ItemType Directory -Force $cadangan | Out-Null
    Move-Item $tujuan (Join-Path $cadangan 'motion-graphic-3d')
    Write-Output "cadangan: motion-graphic-3d -> $cadangan"
}
Copy-Item -Recurse (Join-Path $akar 'motion-graphic-3d') $tujuan
Get-ChildItem -Recurse $tujuan -Include '__pycache__' -Directory | Remove-Item -Recurse -Force
Write-Output "terpasang: $tujuan"
