$(document).ready(function() {


    $(function() {
        //hang on event of form with id=myform
        $(".add").submit(function(e) {

            //prevent Default functionality
            e.preventDefault();

            var lines = $('#polloptiontext').val().split(/\n/);
            var texts = [];
            for (var i = 0; i < lines.length; i++) {
                // only push this line if it contains a non whitespace character.
                if (/\S/.test(lines[i])) {
                    texts.push($.trim(lines[i]));
                }
            }
            console.log(texts);

            var data = {
                "title": $("#title").val,
                "options": texts

            };
            console.log(data);
            data = JSON.parse(data)
            console.log(data);

            //get the action-url of the form
            var actionurl = '/addpoll';

            //do your own request an handle the results
            // $.ajax({
            //     url: 'https://clementine-freecodecamp-pankajcoding.c9users.io/addpoll',
            //     type: 'post',
            //     dataType: 'application/json',
            //     data:{
            //     title:$("#title").val,
            //     options:'options'

            // },
            //     success: function() {

            //     }
            // });

            $.ajax({
                type: 'post',
                url: 'addpoll',
                data: data,
                success: function(response) {
                    alert("Success !!");
                },
                error: function() {
                    alert("Error !!");
                }
            });

        });

    });
})
