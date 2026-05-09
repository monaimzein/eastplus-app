param()
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

# Map: relative path -> unsplash photo id (verified) + sizing
$jobs = @(
    # Hero (1920x1080)
    @{ Path = 'public/images/hero/hero-1.jpg';            Id = 'photo-1504307651254-35680f356dfd'; W = 1920; H = 1080 } # construction site dusk
    @{ Path = 'public/images/hero/hero-2.jpg';            Id = 'photo-1581092921461-eab62e97a780'; W = 1920; H = 1080 } # engineer tablet
    @{ Path = 'public/images/hero/hero-3.jpg';            Id = 'photo-1541888946425-d81bb19240f5'; W = 1920; H = 1080 } # construction workers

    # Services (1600x1000)
    @{ Path = 'public/images/services/plumbing.jpg';      Id = 'photo-1584622650111-993a426fbf0a'; W = 1600; H = 1000 } # plumbing fittings
    @{ Path = 'public/images/services/electrical.jpg';    Id = 'photo-1565608087341-404b25492cee'; W = 1600; H = 1000 } # electrical
    @{ Path = 'public/images/services/construction.jpg';  Id = 'photo-1503387762-592deb58ef4e';    W = 1600; H = 1000 } # construction
    @{ Path = 'public/images/services/sanitary.jpg';      Id = 'photo-1552321554-5fefe8c9ef14';    W = 1600; H = 1000 } # luxury bathroom
    @{ Path = 'public/images/services/insulation.jpg';    Id = 'photo-1574359411659-15573a27fd0c'; W = 1600; H = 1000 } # roofing
    @{ Path = 'public/images/services/maintenance.jpg';   Id = 'photo-1621905251189-08b45d6a269e'; W = 1600; H = 1000 } # technician
    @{ Path = 'public/images/services/projects.jpg';      Id = 'photo-1487958449943-2429e8be8625'; W = 1600; H = 1000 } # building

    # About
    @{ Path = 'public/images/about/about-hero.jpg';       Id = 'photo-1542621334-a254cf47733d';    W = 1920; H = 1080 } # riyadh skyline
    @{ Path = 'public/images/about/about-team.jpg';       Id = 'photo-1556761175-5973dc0f32e7';    W = 1600; H = 1200 } # business team

    # Gallery covers (1200x1500 portrait)
    @{ Path = 'public/images/gallary/cover-fallback.jpg'; Id = 'photo-1503387762-592deb58ef4e';    W = 1200; H = 1500 }
    @{ Path = 'public/images/gallary/البناء/cover.jpg';    Id = 'photo-1504307651254-35680f356dfd'; W = 1200; H = 1500 }
    @{ Path = 'public/images/gallary/الكهرباء/cover.jpg';  Id = 'photo-1565608087341-404b25492cee'; W = 1200; H = 1500 }
    @{ Path = 'public/images/gallary/السباكة/cover.jpg';   Id = 'photo-1584622650111-993a426fbf0a'; W = 1200; H = 1500 }

    # Construction gallery samples (1080x1080)
    @{ Path = 'public/images/gallary/البناء/01.jpg';       Id = 'photo-1486406146926-c627a92ad1ab'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/البناء/02.jpg';       Id = 'photo-1429497419816-9ca5cfb4571a'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/البناء/03.jpg';       Id = 'photo-1581094271901-8022df4466f9'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/البناء/04.jpg';       Id = 'photo-1503387762-592deb58ef4e';    W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/البناء/05.jpg';       Id = 'photo-1590725140246-20acdee442be'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/البناء/06.jpg';       Id = 'photo-1517089596392-fb9a9033e05b'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/البناء/07.jpg';       Id = 'photo-1531834685032-c34bf0d84c77'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/البناء/08.jpg';       Id = 'photo-1590650046871-92c887180603'; W = 1080; H = 1080 }

    # Electrical gallery samples
    @{ Path = 'public/images/gallary/الكهرباء/01.jpg';     Id = 'photo-1565608087341-404b25492cee'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/الكهرباء/02.jpg';     Id = 'photo-1631467053406-95f59d8c93a3'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/الكهرباء/03.jpg';     Id = 'photo-1620661312000-20c84f4135b7'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/الكهرباء/04.jpg';     Id = 'photo-1558002038-1055907df827'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/الكهرباء/05.jpg';     Id = 'photo-1473341304170-971dccb5ac1e'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/الكهرباء/06.jpg';     Id = 'photo-1605647540924-852290f6b0d5'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/الكهرباء/07.jpg';     Id = 'photo-1473073533101-a08b6cebc3c0'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/الكهرباء/08.jpg';     Id = 'photo-1581092160562-40aa08e78837'; W = 1080; H = 1080 }

    # Plumbing gallery samples
    @{ Path = 'public/images/gallary/السباكة/01.jpg';      Id = 'photo-1584622650111-993a426fbf0a'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/السباكة/02.jpg';      Id = 'photo-1552321554-5fefe8c9ef14';    W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/السباكة/03.jpg';      Id = 'photo-1620626011761-996317b8d101'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/السباكة/04.jpg';      Id = 'photo-1564540583246-934409427776'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/السباكة/05.jpg';      Id = 'photo-1604147495798-57beb5d6af73'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/السباكة/06.jpg';      Id = 'photo-1591814468924-caf88d1232e1'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/السباكة/07.jpg';      Id = 'photo-1556909114-f6e7ad7d3136'; W = 1080; H = 1080 }
    @{ Path = 'public/images/gallary/السباكة/08.jpg';      Id = 'photo-1600585154340-be6161a56a0c'; W = 1080; H = 1080 }
)

$ok = 0; $fail = 0
foreach ($j in $jobs) {
    $url = "https://images.unsplash.com/$($j.Id)?w=$($j.W)&h=$($j.H)&fit=crop&q=80&auto=format"
    $out = $j.Path
    try {
        Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop
        $size = (Get-Item $out).Length
        if ($size -lt 5000) { throw "too small ($size bytes)" }
        Write-Host ("OK   {0}  ({1} KB)" -f $out, [int]($size/1024))
        $ok++
    } catch {
        Write-Host ("FAIL {0}  -> {1}" -f $out, $_.Exception.Message) -ForegroundColor Red
        $fail++
    }
}
Write-Host ""
Write-Host ("Done: {0} succeeded, {1} failed" -f $ok, $fail)
