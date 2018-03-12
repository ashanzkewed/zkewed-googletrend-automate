
const electron = nodeRequire('electron');
let ipcRenderer = nodeRequire('electron').ipcRenderer;


$(document).ready(function () {

    run()
    function run() {
        var run='run'
        ipcRenderer.sendSync('ee', run);
    }


    var oldCountry = "";
    var oldTimerange = "";


    $('[data-toggle="tooltip"]').tooltip();
    let tbl = $('#example').DataTable();
    $('#brandText').focus();
    selectedComboData();
    loadComboData();
    loadTableData();


    selectedTimeRangeData();
    //
    // var states = new Array();
    //
    // var substringMatcher = function (strs) {
    //     return function findMatches(q, cb) {
    //         var matches, substringRegex;
    //         // an array that will be populated with substring matches
    //         matches = [];
    //         // regex used to determine if a string contains the substring `q`
    //         substrRegex = new RegExp(q, 'i');
    //         // iterate through the pool of strings and for any string that
    //         // contains the substring `q`, add it to the `matches` array
    //         $.each(strs, function (i, str) {
    //             if (substrRegex.test(str)) {
    //                 matches.push(str);
    //             }
    //         });
    //
    //         cb(matches);
    //     };
    // };
    // $('#the-basics .typeahead').typeahead({
    //         hint: true,
    //         highlight: true,
    //         minLength: 1
    //     },
    //     {
    //         name: 'states',
    //         source: substringMatcher(states)
    //     });


//combo box data
    function loadComboData() {
        var check = "countryData";
        var response = ipcRenderer.sendSync('comboData', check);
        for (var i = 0; i < response.recordset.length; i++) {
            // states.put(response.recordset[i].COUNTRY_NAME);
            console.log(response.recordset[i].COUNTRY_NAME)
            $('#countryCombo').append(new Option(response.recordset[i].COUNTRY_NAME));
        }
    }




    //selected Combo data add
    function selectedComboData() {
        var check = "selectedCountryData";
        var response = ipcRenderer.sendSync('selectedComboData', check);
        for (var i = 0; i < response.recordset.length; i++) {
            $("#countryCombo").val(response.recordset[i].COUNTRY_NAME).change();
        }
    }

    //selected timerange data add
    function selectedTimeRangeData() {
        var check = "selectedTimeRangeData";
        var response = ipcRenderer.sendSync('selectedTimeRangeData', check);
        for (var i = 0; i < response.recordset.length; i++) {
            console.log(response.recordset[i].TIME_RANGE);
            $("#timeRangeCombo").val(response.recordset[i].TIME_RANGE).change();
        }
    }


    //table data load
    function loadTableData() {
        tbl.clear().draw();
        var check = "tableData";
        var response = ipcRenderer.sendSync('TableData', check);


        for (var i = 0; i < response.recordset.length; i++) {
            oldCountry = response.recordset[i].C_CO;
            oldTimerange = response.recordset[i].TIME_RANGE;

            tbl.row.add([response.recordset[i].BRAND, $('#countryCombo').find('option:selected').text(), response.recordset[i].TIME_RANGE, ' <img class="delete"  title="Delete" src="../public/img/delete.png" alt="delete" width="25px" style="margin-left:10%; margin-right:18%;">']).draw();
        }
    }

    //table click to delete brand
    $('#example tbody').on('click', '.delete', function () {
        var brand = $(this).closest('tr').children('td:first').text();
        var response = ipcRenderer.sendSync('deleteBrand', brand);
        loadTableData();
        if (response.rowsAffected[0] > 0) {
            // $(this).closest('tr').remove();
            // swal("Delete Success!", "You clicked the button!", "success");
        } else {
            swal("Delete Fail!", "You clicked the button!", "warning");
        }

    });


//add button click function
    $(".form #addBtn").click(function () {

        var brand = $('#brandText').val();
        var newCountry = $('#countryCombo').find('option:selected').text();
        var newTimerange = $('#timeRangeCombo').find('option:selected').text();

        if (brand === '') {
            //if brand null..will change only country and timerange

            var response = ipcRenderer.sendSync('ChangeCountryandTimeRange', oldCountry, newCountry, oldTimerange, newTimerange);

            loadTableData();
            if (response === true) {
                swal("Changed Success!", "You clicked the button!", "success");
            } else {
                swal("No any Brands!", "Add One Brand!", "warning");
            }
            $('#brandText').focus();
        } else {
            var val = false;

            $('#example tr td:first-child').each(function () {
                if ($(this).html() === brand.toUpperCase()) {
                    val = true;
                    return;
                }
            });
            if (val) {
                $('#brandText').val('');
                swal("Already Exists!", "You clicked the button!", "warning");
            } else {
                var response='';


                var res = ipcRenderer.sendSync('ChangeCountryandTimeRange', oldCountry, newCountry, oldTimerange, newTimerange);
                // console.log( oldCountry+ "---" + newCountry+ "---" + oldTimerange+ "---" + newTimerange)
                if(res==true){
                    response = ipcRenderer.sendSync('addBrand', brand.toUpperCase(), newCountry, newTimerange);
                }else{
                    $('#brandText').val('');
                    swal("Added Fail!", "You clicked the button!", "warning");
                }





                loadTableData();

                if (res.rowsAffected[0] > 0) {
                    $('#brandText').val('');
                    // swal("Added Success!", "You clicked the button!", "success");
                } else {
                    $('#brandText').val('');
                    swal("Added Fail!", "You clicked the button!", "warning");
                }
                $('#brandText').focus();
            }
        }
    });


    ///hit enter on textbox//
    $('#brandText').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            var brand = $('#brandText').val();
            var newCountry = $('#countryCombo').find('option:selected').text();
            var newTimerange = $('#timeRangeCombo').find('option:selected').text();

            if (brand === '') {
                //if brand null..will change only country and timerange

                var response = ipcRenderer.sendSync('ChangeCountryandTimeRange', oldCountry, newCountry, oldTimerange, newTimerange);

                loadTableData();
                if (response === true) {
                    swal("Changed Success!", "You clicked the button!", "success");
                } else {
                    swal("No any Brands!", "Add One Brand!", "warning");
                }
            } else {
                var val = false;

                $('#example tr td:first-child').each(function () {
                    if ($(this).html() === brand.toUpperCase()) {
                        val = true;
                        return;
                    }
                });
                if (val) {
                    $('#brandText').val('');
                    swal("Already Exists!", "You clicked the button!", "warning");
                } else {
                    var response='';


                    var res = ipcRenderer.sendSync('ChangeCountryandTimeRange', oldCountry, newCountry, oldTimerange, newTimerange);
                    // console.log( oldCountry+ "---" + newCountry+ "---" + oldTimerange+ "---" + newTimerange)
                    if(res==true){
                        response = ipcRenderer.sendSync('addBrand', brand.toUpperCase(), newCountry, newTimerange);
                    }else{
                        $('#brandText').val('');
                        swal("Added Fail!", "You clicked the button!", "warning");
                    }





                    loadTableData();

                    if (response.rowsAffected[0] > 0) {
                        $('#brandText').val('');
                        // swal("Added Success!", "You clicked the button!", "success");
                    } else {
                        $('#brandText').val('');
                        swal("Added Fail!", "You clicked the button!", "warning");
                    }
                }
            }

        }
    });


});