<?php
/* 
$myfile = fopen("answers.db", "a") or die ("Unable to open file");

$data = $_GET['data'];
fwrite($myfile, $data . "\n");
fclose($myfile);*/

$answers = json_decode($_GET['data'], true);
//echo "[{comboId:2},{quesId:0,answerId:0},{quesId:1,answerId:3}]";
echo $answers, "<br>";
//echo $_GET['data'];
echo "hello<br>";
//echo $answers;
$comboId = $answers['comboId'];
echo "combo Id:",$comboId, "<br>";
echo $answers['answers'], "<br>";
$answerArray = $answers['answers'];
echo $answerArray[0]['quesId'], "<br>";
echo $answerArray[0]['answerId'], "<br>";
echo $answerArray[1]['quesId'], "<br>";
echo $answerArray[1]['answerId'], "<br>";

$json = json_decode(file_get_contents("answersdb3.json"), true);

for ($i=0; $i<count($json); $i++){
    if (intval($json[$i]['combo']) == $comboId){
	$tempArr = array_slice($answers, 0, 0, true) + 
	                array("respondentNo" => count($json[$i]['answers'])) +
			array_slice($answers, 0, count($answers), true);
        array_push($json[$i]['answers'], $tempArr);
	break;
    }
}

/*
foreach ($json as $element){
    if (intval($element["combo"]) == $comboId){
	//echo $element["combo"];
	//echo $comboId;
        $ansArr = $element["answers"];
	array_push($ansArr, $answers);
	$element["answers"] = $ansArr;
	break;
    }
}*/
file_put_contents("answersdb3.json", json_encode($json, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
?>
