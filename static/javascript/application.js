jQuery(document).ready(function () {
    var $textbox = $("#textbox");
    var $helpbox = $("#helpbox");
    var $textbox_frame = $("#textbox-frame");
    var $helpbox_frame = $("#helpbox-frame");
    var current = 1;
    var saving = false;
    $textbox_frame.show();
    $helpbox_frame.hide();
    jQuery('.textarea-scrollbar').scrollbar();
    $(window).bind('keydown', function (event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 'a':
                    event.preventDefault();
                    if (current == 1) {
                        $textbox.select();
                    } else {
                        $helpbox.select();
                    }
                    break;
                case 's':
                    event.preventDefault();
                    if (saving) {
                        break;
                    }
                    saving = true;
                    if (current == 1) {
                        if (window.location.pathname == '/') {
                            var data = $textbox.val();
                            if (data) {
                                $.post("/paste/", data,
                                    function (key, status) {
                                        if (status == 'success') {
                                            window.location = key;
                                        }
                                        saving = false;
                                    });
                            }
                        }
                    }
                    break;
                case 'r':
                    event.preventDefault();
                    if (saving) {
                        break;
                    }
                    saving = true;
                    if (window.location.pathname == '/') {
                        var data = $textbox.val();
                        if (data) {
                            $.post("/paste/", data,
                                function (key, status) {
                                    if (status == 'success') {
                                        window.location = key + "/raw";
                                    }
                                    saving = false;
                                });
                        }
                    } else {
                        window.location = 'raw';
                    }
                    break;
            }
        }
    });
    $textbox.keydown(function (e) {
        if (e.keyCode === 9) {
            if (window.location.pathname == '/') {
                var start = this.selectionStart;
                end = this.selectionEnd;
                var $this = $(this);
                $this.val($this.val().substring(0, start) + "\t" + $this.val().substring(end));
                this.selectionStart = this.selectionEnd = start + 1;
            }
            return false;
        }
    }
    );
    $("#text").click(function () {
        if (current != 1) {
            current = 1;
            $textbox_frame.fadeIn(500);
            $helpbox_frame.fadeOut(500);
            $textbox.focus();
            $(this).fadeTo(200, 1);
            $("#help").fadeTo(200, 0.25);
        }
    }
    );
    $("#text").mouseenter(function () {
        if (current != 1) {
            $(this).stop();
            $(this).fadeTo(200, 1);
        }
    }
    );
    $("#text").mouseleave(function () {
        if (current != 1) {
            $(this).stop();
            $(this).fadeTo(200, 0.25);
        }
    }
    );
    $("#help").click(function () {
        if (current != 2) {
            current = 2;
            $textbox_frame.fadeOut(500);
            $helpbox_frame.fadeIn(500);
            $(this).fadeTo(200, 1);
            $("#text").fadeTo(200, 0.25);
        }
    }
    );
    $("#help").mouseenter(function () {
        if (current != 2) {
            $(this).stop();
            $(this).fadeTo(200, 1);
        }
    }
    );
    $("#help").mouseleave(function () {
        if (current != 2) {
            $(this).stop();
            $(this).fadeTo(200, 0.25);
        }
    }
    );
});