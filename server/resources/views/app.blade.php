<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Learnova</title>
        
        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('build/src/components/Sources/logo.png') }}">

        <!-- Fonts (Optional) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- Styles and Scripts -->
        @if (app()->environment('local'))
            <!-- During development, load from Vite dev server -->
            <script type="module" src="http://localhost:8080/src/main.tsx"></script>
        @else
            <!-- In production, load from the build folder -->
            @php
                $manifestPath = public_path('build/.vite/manifest.json');
                $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : null;
                $mainJs = $manifest ? 'build/' . $manifest['index.html']['file'] : null;
                $mainCss = $manifest ? 'build/' . $manifest['index.html']['css'][0] : null;
            @endphp

            @if ($mainCss)
                <link rel="stylesheet" href="{{ asset($mainCss) }}">
            @endif
            @if ($mainJs)
                <script type="module" src="{{ asset($mainJs) }}"></script>
            @endif
        @endif
    </head>
    <body class="antialiased">
        <div id="root"></div>
    </body>
</html>
