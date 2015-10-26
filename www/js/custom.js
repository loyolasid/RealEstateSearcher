var slider;
var viewRealEstate;

$(document).ready(function() {
    var selected;

    slider = $('.bxslider').bxSlider({
        auto: true,
        autoControls: true,
        useCSS: true,
        /*mode: 'vertical'*/
    });
    // alert(cordova.file.dataDirectory);
    $('#bed_room').change(function() {
        //alert($('#bed_room').val());
    });

    $('#type').change(function() {
        // alert($('#type').val());
    });
    $(document.body).on('click', '.home', function() {

    });
    $('.home').click(function() {
        slider.reloadSlider();
    });
    $(document.body).on('click', '.selected', function() {
        /*
        $('#site_name').html(selected.name);
        $("#address").html(selected.address);
        $("#sqft").html(300);
        $("#description").html(selected.description);
        $("#bedroom").html(selected.bedrooms);
        if (selected.type == 'apt') {
            $("#apttype").html("Apartment");
        } else {
            $("#apttype").html("Individual House");
        }
        $('#gallery').empty();
        $('#gallery').append("<ul id='gallery_view'></ul>");

        for (var v in selected.images) {
            $('#gallery_view').append("<li> <img src = './img/" + selected.images[v] + "' /> </li>");
        }
        $('#gallery_view').bxSlider({
            auto: true,
            autoControls: true,
            useCSS: true
        });*/
    });

    $('#submit').click(function() {
        var address = $('#search').val();
        console.log(address);
        var bedrooms = $('#bed_room').val();
        console.log(bedrooms);
        var type = $('#type').val();
        $("#list").empty();
        selected = data[0];
        //$('#result').append(' <ul id="list" data-role="listview"></ul>');
        var status;
        for (var v in data) {
            status = false;
            if (type == data[v].type) {
                if (bedrooms == "" || bedrooms == data[v].bedrooms) {
                    status = true;
                } else {
                    continue;
                }
                //alert(data[v].address.toLowerCase()+"  "+address.toLowerCase());
                if (address == "" || (data[v].address.toLowerCase().indexOf(address.toLowerCase()) != -1)) {
                    status = true;
                } else {
                    continue;
                }
            }
            if (status) {
                $("#list").append("<li><a href='#viewPage' onclick='favClick(" + JSON.stringify(data[v]) + ")'>" + data[v].name + "</a></li>");
            }
        }
        $("#list").listview("refresh");
    });
    /*$(document.body).on('click', '.selected', function() {
        
    });*/
    $('#save_btn').click(function() {
        // alert("in save function" + viewRealEstate.name);
        if (viewRealEstate.favourite == 0) {
            saveRealEstate(viewRealEstate);
        } else {
            removeRealEstate(viewRealEstate);
        }


    });

    $(document).on('pagebeforeshow', '#home_page', function(event) {
        slider.reloadSlider();
    });

    $(document).on('pagebeforeshow', '#search_page', function(event) {

    });
    $(document).on('pagebeforeshow', '#recent_page', function(event) {
        // alert('aaaa');
        console.log(existing_data);
        $("#fav_list").empty();
        //$('#fav_list').append(' <ul id="selected_list" data-role="listview"></ul>');
        for (var v in existing_data) {
            $("#fav_list").append("<li><a href='#viewPage' onclick='favClick(" + JSON.stringify(existing_data[v]) + ")'>" + existing_data[v].name + "</a></li>");
        }
        $("#fav_list").listview("refresh");
    });
});

function getRealEstate(id) {
    for (var v in data) {
        if (data[v].id == id) {
            favClick(data[v]);
            break;
        }
    }
}

function favClick(realEstate) {
    viewRealEstate = realEstate;
    //alert(realEstate);
    for (var v in existing_data) {
        if (existing_data[v].id == realEstate.id) {
            realEstate.favourite = 1;
        }
    }

    if (realEstate.favourite == 1) {
        $('#save_btn').buttonMarkup({
            theme: 'b'
        });
    } else {
        $('#save_btn').buttonMarkup({
            theme: 'a'
        });
    }

    $('#site_name').html(realEstate.name);
    $("#address").html(realEstate.address);
    $("#sqft").html(300);
    $("#description").html(realEstate.description);
    $("#bedroom").html(realEstate.bedrooms);
    if (realEstate.type == 'apt') {
        $("#apttype").html("Apartment");
    } else {
        $("#apttype").html("Individual House");
    }
    $('#gallery').empty();
    $('#gallery').append("<ul id='gallery_view'></ul>");

    for (var v in realEstate.images) {
        $('#gallery_view').append("<li> <img src = './img/" + realEstate.id + "/" + realEstate.images[v] + "' /> </li>");
    }
    $('#gallery_view').bxSlider({
        auto: true,
        autoControls: true,
        useCSS: true
    });
}
document.addEventListener("backbutton", function(e) {
    alert("" + $.mobile.activePage.is("#viewPage"));
    if ($.mobile.activePage.is('#viewPage')) {
        /* 
         Event preventDefault/stopPropagation not required as adding backbutton
          listener itself override the default behaviour. Refer below PhoneGap link.
        */
        //e.preventDefault();
        navigator.app.backHistory()

    } else {
        navigator.app.exitApp();
    }
}, false);

function saveRealEstate(viewRealEstate) {
    //if(existing_data=== undifined)
    viewRealEstate.favourite = 1;
    existing_data.push(viewRealEstate);
    write(JSON.stringify(existing_data));
    //if (realEstate.favourite == 1) {
    $('#save_btn').buttonMarkup({
        theme: 'b'
    });
    //}
}

function removeRealEstate(viewRealEstate) {
    viewRealEstate.favourite = 0;
    for (var i = existing_data.length - 1; i >= 0; i--) {
        if (existing_data[i].id === viewRealEstate.id) {
            existing_data.splice(i, 1);
            write(JSON.stringify(existing_data));
            $('#save_btn').buttonMarkup({
                theme: 'a'
            });
        }
    }
}

document.addEventListener("deviceready", onDeviceReady, true);

function onDeviceReady() {
    //request the persistent file system
    if (window.webkitRequestFileSystem) {
        window.webkitRequestFileSystem(window.PERSISTENT, 0, onFSSuccess, errorHandler);
    } else {
        window.requestFileSystem(window.PERSISTENT, 0, onFSSuccess, errorHandler);
    }
}
var fileSystem;
var folder_path = "RealEstateSearcher/";
var data_file = folder_path + "favourite.txt";
/*var existing_data = [{
    "id": 1,
    "name": "aaaa",
    "latlong": "17.4339907,78.4416412",
    "address": "Ameerppet",
    "type": "apt",
    "images": ["hill_trees.jpg", "houses.jpg", "me_trees.jpg"],
    "bedrooms": "1",
    "favourite": 0,
    "description": "Only one page is visible at a time. Upon navigation, the currently visible page is hidden, and another page is shown. Moving from one page to another is accomplished via a transition. This is not possible when navigating between HTML documents via HTTP, because the browser discards all state associated with the source page when navigating to the target page, making it impossible to perform this task via a smooth transition effect such as a fade or a slide."

}];*/
var existing_data = [];

function onFSSuccess(fs) {
    fileSystem = fs;
    fs.root.getDirectory('RealEstateSearcher', {
        create: true
    }, function(f) {
        console.log("folder success" + fileSystem.root.fullPath + data_file);
    }, errorHandler);

    fileSystem.root.getFile(data_file, {
        create: true
    }, function(f) {
        fileSystem.root.getFile(data_file, {
            create: true
        }, function(fileEntry) {
            fileEntry.file(function(f) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var favourite = this.result;
                    if (favourite === "") {
                        //alert(jQuery.type(data)); // string
                    } else {
                        //alert(jQuery.type(data)); // string
                        //console.log(data);
                        console.log(favourite);
                        favourite = JSON.parse(favourite);
                        // alert(jQuery.type(data)); // object
                        // console.log(data); //object
                    }

                    // console.log(JSON.stringify(data));

                    if (favourite === "") {
                        // write(existing_data);
                    } else {
                        existing_data = favourite;

                    }
                };
                reader.readAsText(f);
            }, errorHandler);
        }, errorHandler);
    }, errorHandler);
}


function errorHandler(e) {
    var msg = '';
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };
    alert(msg);
}

function write(matter) {
    console.log(fileSystem.root.fullPath);
    fileSystem.root.getFile(data_file, {
        create: true
    }, function(f) {
        f.createWriter(function(writerOb) {
            writerOb.onwrite = function() {};
            writerOb.write(matter);
            //alert(existing_data);
        });
    }, errorHandler);
}