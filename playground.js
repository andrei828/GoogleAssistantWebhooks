const a  = { "options": [
    {
      "unit": "ST",
      "key": "Deckel für Glas-EH-Flasche.vierk. 100 ml"
    },
    {
      "key": "Deckel für PVC-Weithals-Flasche 250 ml",
      "unit": "ST"
    },
    {
      "unit": "ST",
      "key": "Deckel für PVC-Weithals-Flasche 1L + 2L"
    }
  ]}


  for (let obj of a.options) {
    if (obj.key == "Deckel für PVC-Weithals-Flasche 1L + 2L") {
        console.log("HEHE", obj.unit)
    }
}
return null