# Pasang skill kartun-3d (dulu motion-graphic-3d) ke %USERPROFILE%\.claude\skills, dengan cadangan versi lama.
# Juga memasang pintasan /motion-graphic-3d (folder berisi satu SKILL.md yang menunjuk ke kartun-3d).
$ErrorActionPreference = 'Stop'
$akar = Split-Path -Parent $MyInvocation.MyCommand.Path
$skills = Join-Path $env:USERPROFILE '.claude\skills'
$cadangan = Join-Path $env:USERPROFILE ('.claude\skills-cadangan\' + (Get-Date -Format 'yyyy-MM-dd HHmmss'))
New-Item -ItemType Directory -Force $skills | Out-Null
foreach ($nama in @('kartun-3d', 'motion-graphic-3d')) {
    $tujuan = Join-Path $skills $nama
    if (Test-Path $tujuan) {
        New-Item -ItemType Directory -Force $cadangan | Out-Null
        Move-Item $tujuan (Join-Path $cadangan $nama)
        Write-Output "cadangan: $nama -> $cadangan"
    }
    Copy-Item -Recurse (Join-Path $akar $nama) $tujuan
    Get-ChildItem -Recurse $tujuan -Include '__pycache__' -Directory | Remove-Item -Recurse -Force
    Write-Output "terpasang: $tujuan"
}
