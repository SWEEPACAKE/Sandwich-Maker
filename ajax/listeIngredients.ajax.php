<?php
$database = new mysqli("192.168.56.56", "homestead", "secret", "subway");
mysqli_set_charset($database, "utf8mb4");

$requeteRecette = "SELECT * FROM recette WHERE id = ?";
$recette = $database->execute_query($requeteRecette, array($_POST['id_recette']))->fetch_assoc();

$requeteIngredients = "SELECT id_ingredient FROM recette_ingredient WHERE id_recette = ?";
$tableauIngredients = array();
$ingredients = $database->execute_query($requeteIngredients, array($_POST['id_recette']));
while($row = $ingredients->fetch_assoc()) {
    if(is_array($row)) {
        array_push($tableauIngredients, $row['id_ingredient']);
    }
}

echo json_encode(
    array(
        "recette" => $recette,
        "ingredients" => $tableauIngredients
    )
);