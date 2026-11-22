$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$wiki = Join-Path $root 'wiki'
$index = Join-Path $wiki 'index.md'
$topics = @(Get-ChildItem (Join-Path $wiki 'topics') -File -Filter '*.md')
$sources = @(Get-ChildItem (Join-Path $wiki 'sources') -File -Filter '*.md')
$manifest = Get-Content -LiteralPath (Join-Path $root 'sources/index.md') -Raw -Encoding UTF8
$issues = [Collections.Generic.List[string]]::new()
$links = 0
$topicLinks = 0
if ($topics.Count -ne 6) { $issues.Add('Expected six topic pages.') }
if ($sources.Count -ne 7) { $issues.Add('Expected seven source pages.') }

foreach ($file in @(Get-Item -LiteralPath $index) + $topics + $sources) {
    $body = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    if ($body -notmatch '(?m)^# \S') { $issues.Add("Missing title: $($file.Name)") }
    if ($file.Directory.Name -eq 'topics') {
        if ($body -notmatch '\.\./sources/S0[1-7]\.md#evidence') {
            $issues.Add("No evidence citation: $($file.Name)")
        }
    }
    if ($file.Directory.Name -eq 'sources') {
        $id = $file.BaseName
        if ($id -notmatch '^S0[1-7]$' -or
            [regex]::Matches($manifest, "(?m)^\| $id \|").Count -ne 1 -or
            $body -notmatch '(?m)^## Evidence\s*$' -or $body -notmatch '\.\./topics/[^)]+\.md') {
            $issues.Add("Incomplete source or manifest entry: $id")
        }
    }
    foreach ($link in [regex]::Matches($body, '\[[^\]\r\n]+\]\(([^)\r\n]+)\)')) {
        $target = $link.Groups[1].Value
        if ($target -match '^https?://') { continue }
        $links++
        $path, $anchor = $target -split '#', 2
        $fullPath = [IO.Path]::GetFullPath((Join-Path $file.DirectoryName $path))
        if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
            $issues.Add("Broken link in $($file.Name): $target")
            continue
        }
        $targetBody = Get-Content -LiteralPath $fullPath -Raw -Encoding UTF8
        if ($anchor) {
            $headings = [regex]::Matches($targetBody, '(?m)^#+ (.+)$')
            $slugs = @($headings | ForEach-Object { $_.Groups[1].Value.Trim().ToLowerInvariant() -replace '\s+', '-' })
            if ($anchor -notin $slugs) { $issues.Add("Missing heading in $($file.Name): $target") }
        }
        if ($file.Directory.Name -eq 'topics' -and $path -match '^\.\./sources/') {
            if (-not $targetBody.Contains("../topics/$($file.Name)")) {
                $issues.Add("Missing source backlink: $target -> $($file.Name)")
            }
        }
        if ($file.Directory.Name -eq 'topics' -and $path -match '^[a-z-]+\.md$') { $topicLinks++ }
    }
}
$indexBody = Get-Content -LiteralPath $index -Raw -Encoding UTF8
foreach ($file in $topics + $sources) {
    if (-not $indexBody.Contains("$($file.Directory.Name)/$($file.Name)")) {
        $issues.Add("Missing index entry: $($file.Name)")
    }
}
Write-Output "Topics: $($topics.Count). Sources: $($sources.Count). Local links: $links. Topic cross-links: $topicLinks."
if ($issues.Count) {
    $issues | Write-Output
    exit 1
}
Write-Output 'Structural lint passed.'
