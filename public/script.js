if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

if (!Element.prototype.remove) {
  Element.prototype.remove = function () {
    this.parentNode.removeChild(this);
  };
}

window.onload = function () {
  var format = document.getElementById('format'),
      output = document.getElementById('output'),
      loader = document.getElementById('loader'),
      editor = CodeMirror.fromTextArea(document.getElementById('input'), {mode: "php"}),
      postJson = function (url, urlQuery, done) {
        var request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            done(JSON.parse(request.responseText));
          }
        };
        request.send(urlQuery);
      },
      refresh = function () {
        loader.style.display = 'block';
        postJson(
            'process.php',
            'format=' + encodeURIComponent(format.value)
              + '&code=' + encodeURIComponent(editor.getValue()),
            function (result) {
              loader.style.display = 'none';
              if (result.code) {
                CodeMirror.runMode(result.code, result.mime, output);
              } else {
                if (result.error) {
                  console.error(result.error);
                }

                alert('An error has occurred (see details in console).');
              }
            }
        );
      };

  editor.on('changes', function () { refresh(); });
  format.onchange = function () { refresh(); };

  refresh();
};
