$(document).ready(function() {
  // Handler for .ready() called.
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "application/xml",
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: false,
    maxScanLines: -1,
    maxHighlightLength: -1
  });

  var editor2 = CodeMirror.fromTextArea(document.getElementById("code2"), {
    mode: "application/xml",
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: true
  });

  $("#pygmentify-btn").on("click", function() {
    $("#pygmentify-btn").prop("disabled", true);
    const code = editor.getValue();
    const language = $("#language-select").val();
    const data = {
      language: language,
      code: code,
      formatter: "html"
    };
    console.log("language", language, JSON.stringify(data));
    fetch(
      "https://lambda.pygmentify.com/dev/pygmentify",
      {
        method: "post",
        mode: "cors",
        body: JSON.stringify(data)
      }
    )
      .then(function(response) {
        $("#pygmentify-btn").prop("disabled", false);
        if (!response.ok) {
          console.log("Response:", response.json());
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(function(data) {
        editor2.setValue(data["code"]);
      })
      .catch(function(error) {
        $("#pygmentify-btn").prop("disabled", false);
        console.log(error);
      });

    console.log(code);
  });

  $.each(pygments_languages, function(idx, obj) {
    const selected = obj["value"] === "python";
    $("#language-select").append(
      $(new Option(obj["name"], obj["value"], selected, selected))
    );
  });
  $("#language-select").selectpicker();
});
