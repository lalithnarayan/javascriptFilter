// This function fetches the JSON Data
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


// This code renders the table
function renderTable(data) {

    var table = document.createElement("TABLE");
    table.id = 'dataTable';
    table.border = "1";
    var tableHeader = ["Payment ID", "Date", "Merchant ID", "Email ID", "Amount", "Status"];
    table.className += ' data-table';
    var columnCount = Object.keys(data[0]).length;
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
