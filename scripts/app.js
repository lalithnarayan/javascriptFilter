// var Pagination = {

//     code: '',

//     // --------------------
//     // Utility
//     // --------------------

//     // converting initialize data
//     Extend: function(data) {
//         debugger;
//         data = data || {};
//         Pagination.size = data.size || 30;
//         Pagination.page = data.page || 1;
//         Pagination.step = data.step || 3;
//     },

//     // add pages by number (from [s] to [f])
//     Add: function(s, f) {
//         for (var i = s; i < f; i++) {
//             Pagination.code += '<a>' + i + '</a>';
//         }
//     },

//     // add last page with separator
//     Last: function() {
//         Pagination.code += '<i>...</i><a>' + Pagination.size + '</a>';
//     },

//     // add first page with separator
//     First: function() {
//         Pagination.code += '<a>1</a><i>...</i>';
//     },



//     // --------------------
//     // Handlers
//     // --------------------

//     // change page
//     Click: function() {
//         Pagination.page = +this.innerHTML;
//         Pagination.Start();
//     },

//     // previous page
//     Prev: function() {
//         Pagination.page--;
//         if (Pagination.page < 1) {
//             Pagination.page = 1;
//         }
//         Pagination.Start();
//     },

//     // next page
//     Next: function() {
//         Pagination.page++;
//         if (Pagination.page > Pagination.size) {
//             Pagination.page = Pagination.size;
//         }
//         Pagination.Start();
//     },



//     // --------------------
//     // Script
//     // --------------------

//     // binding pages
//     Bind: function() {
//         var a = Pagination.e.getElementsByTagName('a');
//         for (var i = 0; i < a.length; i++) {
//             if (+a[i].innerHTML === Pagination.page) a[i].className = 'current';
//             a[i].addEventListener('click', Pagination.Click, false);
//         }
//     },

//     // write pagination
//     Finish: function() {
//         Pagination.e.innerHTML = Pagination.code;
//         Pagination.code = '';
//         Pagination.Bind();
//     },

//     // find pagination type
//     Start: function() {
//         if (Pagination.size < Pagination.step * 2 + 6) {
//             Pagination.Add(1, Pagination.size + 1);
//         } else if (Pagination.page < Pagination.step * 2 + 1) {
//             Pagination.Add(1, Pagination.step * 2 + 4);
//             Pagination.Last();
//         } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
//             Pagination.First();
//             Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
//         } else {
//             Pagination.First();
//             Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
//             Pagination.Last();
//         }
//         Pagination.Finish();
//     },



//     // --------------------
//     // Initialization
//     // --------------------

//     // binding buttons
//     Buttons: function(e) {
//         var nav = e.getElementsByTagName('a');
//         nav[0].addEventListener('click', Pagination.Prev, false);
//         nav[1].addEventListener('click', Pagination.Next, false);
//     },

//     // create skeleton
//     Create: function(e) {

//         var html = [
//             '<a>&#9668;</a>', // previous button
//             '<span></span>', // pagination container
//             '<a>&#9658;</a>' // next button
//         ];

//         e.innerHTML = html.join('');
//         Pagination.e = e.getElementsByTagName('span')[0];
//         Pagination.Buttons(e);
//     },

//     // init
//     Init: function(e, data) {
//         Pagination.Extend(data);
//         Pagination.Create(e);
//         Pagination.Start();
//     }
// };


function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'assets/data.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function init() {

    loadJSON(function(response) {
        var actual_JSON = JSON.parse(response);
        renderTable(actual_JSON);
    });


}
init();

function renderTable(data) {

    var table = document.createElement("TABLE");
    table.id = 'dataTable';
    table.border = "1";
    var tableHeader = ["Payment ID", "Date", "Merchant ID", "Email ID", "Amount", "Status"];
    table.className += ' data-table';
    //Get the count of columns.
    var columnCount = Object.keys(data[0]).length;
    // table.setAttribute("data-table", "order-table");
    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.addEventListener('click', sortTable.bind(null, i));
        headerCell.innerHTML = tableHeader[i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (var i = 1; i < data.length; i++) {
        row = table.insertRow(-1);
        for (var property in data[i]) {
            if (data[i].hasOwnProperty(property)) {

                var cell = row.insertCell(-1);
                cell.innerHTML = data[i][property];
            }
        }
    }

    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);

    Pagination.Init(document.getElementById('pagination'), {
        size: data.length / 3, // pages size
        page: 1, // selected page
        step: 3 // pages before and after current
    });
    Pagination.Click(data, function() {
        debugger;
    })
}

// Sort Table
function sortTable(n) {
    if (n === 0 || n === 1 || n === 4) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("dataTable");
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            rows = table.getElementsByTagName("TR");
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

}

// Filter Function

function filterTable(){
    // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("dataTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[5];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}
