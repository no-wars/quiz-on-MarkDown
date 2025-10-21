<?php
// index.php
?>
<!DOCTYPE html>
<html lang="ka">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quiz-ების სია</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link href="css/main.css" rel="stylesheet">


</head>
<body>

<div class="container py-5 text-center">
  <p class="subtitle mb-4">აირჩიეთ კატეგორია და სირთულე</p>

  <div class="search-box">
    <input type="text" id="searchInput" class="form-control" placeholder="🔎 ძიება...">
  </div>

  <div class="row g-4 justify-content-center" id="dirContainer"></div>
</div>

<script src='./js/main.js'></script>

</body>
</html>

