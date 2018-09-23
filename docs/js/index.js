$(document).ready(function() {
  // Handler for .ready() called.
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "application/xml",
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: false
  });

  var editor2 = CodeMirror.fromTextArea(document.getElementById("code2"), {
    mode: "application/xml",
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: false
  });

  $("#pygmentify-btn").on("click", function() {
    //   const code = $("#code").val();
    const code = editor.getValue();
    const language = $("#language-select").val();
    const data = {
      language: language,
      code: code,
      formatter: "html"
    };
    console.log("language", language, JSON.stringify(data));
    fetch(
      "https://pm3ou8uore.execute-api.us-east-1.amazonaws.com/dev/pygmentify",
      {
        method: "post",
        mode: "cors",
        body: JSON.stringify(data)
      }
    )
      .then(function(response) {
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
        console.log(error);
      });

    console.log(code);
  });

  $.each(pygments_languages, function(idx, obj) {
    $("#language-select").append($(new Option(obj["name"], obj["value"])));
  });
  $("#language-select").selectpicker();
});
