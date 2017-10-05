const MAXCOLUMNS = 10;
const MAXROWS = 10;

const SHIPTYPES =   [2,    3,        4,    5];
const SHIPSPAWNS =  [1,    1 + 1,    1,    1];

$(() => {
  // Select table containing the battleground
  const BATTLEGROUND = $('#battleground');

  // Build 10 x 10 grid for battleground
  for (let row = 0; row < MAXROWS; row++) {
    // Create table row
    const tr = $('<tr>');
    for (let column = 0; column < MAXCOLUMNS; column++) {
      // Create table cell with CSS class `water`. Note that we use
      // HTML data attributes  to store the coordinates of each cell
      // (see https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). 
      // That makes it much easier to find cells based on coordinates later.
      $('<td>').addClass('water').attr('data-r', row).attr('data-c', column).appendTo(tr);
    }

    // Add table row to battleground table
    tr.appendTo(battleground);
  }



  $('#generate').click(() => {
    // reset battlefield
    for (let row = 0; row < MAXROWS; row++) {
      for (let column = 0; column < MAXCOLUMNS; column++) {
        $(`td[data-r="${row}"][data-c="${column}"]`).removeClass('ship').addClass('water');
      }
    }

    // create ships
    for(let shipType = 0; shipType < SHIPTYPES.length; shipType++) {
      for(let shipSpawn = 0; shipSpawn < SHIPSPAWNS[shipType]; shipSpawn++) {
        while(!createShip(SHIPTYPES[shipType]));
      }
    }
  });
});

function createShip(shipLength) {
  const DIRECTION = Math.round(Math.random()) == 1;

  // Also if i reduce the position by the shipLength now, have have not to do extra bound checks
  // x = column, y = row
  var posx = Math.round(Math.random() * (MAXCOLUMNS - (DIRECTION ? shipLength : 1)));
  var posy = Math.round(Math.random() * (MAXROWS - (!DIRECTION ? shipLength : 1)));

  if(DIRECTION) {
    // checking Border on vertical direction/column of ShipLength
    for(let x = posx; x < posx + shipLength; x++) {
      if(checkBorder(x, posy)) {
        return false;
      }
    }

    // placing ship
    for(let x = posx; x < posx + shipLength; x++) {
      $(`td[data-r="${posy}"][data-c="${x}"]`).removeClass('water').addClass('ship');
    }
  } 
  else {
    // checking Border on horizontal direction/row of ShipLength
    for (let y = posy; y < posy + shipLength; y++) {
      if(checkBorder(posx, y)) {
        return false;
      }
    }

    // placing ship
    for(let y = posy; y < posy + shipLength; y++) {
      $(`td[data-r="${y}"][data-c="${posx}"]`).removeClass('water').addClass('ship');
    }
  }

  return true;
}

// checks Border   if a ship class is on border --> true
function checkBorder(posx, posy) {
  return ((posx + 1 <= 9 && $(`td[data-r="${posy}"][data-c="${posx + 1}"]`).hasClass('ship')) ||
          (posx - 1 >= 0 && $(`td[data-r="${posy}"][data-c="${posx - 1}"]`).hasClass('ship')) ||
          (posy + 1 <= 9 && $(`td[data-r="${posy + 1}"][data-c="${posx}"]`).hasClass('ship')) ||
          (posy - 1 >= 0 && $(`td[data-r="${posy - 1}"][data-c="${posx}"]`).hasClass('ship')));
}