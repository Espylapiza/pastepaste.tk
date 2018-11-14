jQuery(document).ready(function () {
    const trans = 0.25;
    var $textbox = $("#textbox");
    var $textbox_form = $("#textbox-form");
    var $helpbox_form = $("#helpbox-form");
    var current = 1;
    var is_saving = false;
    $.fn.save = function () {
        if (window.location.pathname == '/') {
            if (is_saving) {
                return;
            }
            is_saving = true;
            var data = $textbox.val();
            if (data) {
                $.post("/paste/", data,
                    function (key, status) {
                        if (status == 'success') {
                            window.location.replace(key);
                        }
                        is_saving = false;
                    });
            } else {
                is_saving = false;
            }
        }
    }
    $.fn.raw = function () {
        if (window.location.pathname == '/') {
            if (is_saving) {
                return;
            }
            is_saving = true;
            var data = $textbox.val();
            if (data) {
                $.post("/paste/", data,
                    function (key, status) {
                        if (status == 'success') {
                            window.location.replace(key + '/raw');
                        }
                        is_saving = false;
                    });
            } else {
                is_saving = false;
            }
        } else {
            window.location = 'raw';
        }
    }
    jQuery('.textarea-scrollbar').scrollbar();
    $(window).bind('keydown', function (event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 'a':
                    event.preventDefault();
                    if (current == 1) {
                        $textbox.select();
                    }
                    break;
                case 's':
                    event.preventDefault();
                    $.fn.save();
                    break;
                case 'r':
                    event.preventDefault();
                    $.fn.raw();
                    break;
            }
        }
    });
    $("a#save").click(function () {
        $.fn.save();
        return false;
    });
    $("a#raw").click(function () {
        $.fn.raw();
        return false;
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
            $textbox_form.fadeIn(500);
            $helpbox_form.fadeOut(500);
            $textbox.focus();
            $(this).fadeTo(200, 1);
            $("#help").fadeTo(200, trans);
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
            $(this).fadeTo(200, trans);
        }
    }
    );
    $("#help").click(function () {
        if (current != 2) {
            current = 2;
            $textbox_form.fadeOut(500);
            $helpbox_form.fadeIn(500);
            $(this).fadeTo(200, 1);
            $("#text").fadeTo(200, trans);
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
            $(this).fadeTo(200, trans);
        }
    }
    );
});