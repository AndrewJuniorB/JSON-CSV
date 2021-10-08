$(document).ready(function () {
  console.log("ready!");
  $('form').on('submit', function (e) {
    e.preventDefault();
    // ... more event handler code here
    var reader = new FileReader();
    var fileLoad = document.getElementById('csvGenerator').files;
    // File should exist
    if (fileLoad.length !== 0) {
      reader.onload = function () {
        var dataURL = reader.result;
        $.ajax({
          type: 'POST',
          url: '/',
          data: {
            'name': fileLoad[0].name,
            dataURL
          },
          success: function (result) {
            $('.csvRender').html('');
            $('.csvRender').attr('filename', fileLoad[0].name);
            $('.csvRender').append(result);
          }
        });
      }
      reader.readAsBinaryString(fileLoad[0]);
    }

  });

});

