console.log("HERE!");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "copy") {
    console.log("COPYING");
    copy();

    //sendResponse({ farewell: "goodbye" });
  }
  if (request.action === "paste") {
    console.log("PASTING");
    paste();
    //sendResponse({ farewell: "goodbye" });
  }
});

function copy() {
  var sheetId = window.location.pathname.split("/")[3];
  var base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  var sheetName = encodeURIComponent('UA - IP Filters');
  var query = encodeURIComponent('Select *');
  var url = `${base}&sheet=${sheetName}&tq=${query}`;

  fetch(url)
    .then((res) => res.text())
    .then((rep) => {
      //Remove additional text and extract only JSON:
      const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
      processData(jsonData);
    });
}

function processData(sData) {
  var rows = sData.table.rows;
  var accountName = rows[0].c[4].v;
  var filledRows = rows.slice(2);
  var proccessedData = [];
  for (row of filledRows) {
    if (row.c[6].v.includes(",")) {
      var cidr_list = row.c[6].v.split(",");
      for (cidr of cidr_list) {
        proccessedData.push({
          filterName: row.c[1].v,
          filterType: row.c[2].v,
          filterField: row.c[3].v,
          matchType: row.c[4].v,
          expressionValue: row.c[5].v,
          cidr: cidr,
        });
      }
    } else {
      proccessedData.push({
        filterName: row.c[1].v,
        filterType: row.c[2].v,
        filterField: row.c[3].v,
        matchType: row.c[4].v,
        expressionValue: row.c[5].v,
        cidr: row.c[6].v,
      });
    }
  }

  console.log([accountName, proccessedData]);
  chrome.storage.local.set({ data: [accountName, proccessedData] }, function () {
    chrome.runtime.sendMessage({
      action: "pData",
      data: [accountName, proccessedData],
    });
  });

  //return [accountName, proccessedData]
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

const typeInto = (el, data) => {
  // Note the use of the InputEvent constructor
  const e = new InputEvent('input', {
    inputType: 'insertText',
    data,
  });
  // Manually add the text to element.value
  el.value += data;
  // Fire the event like you were doing
  el.dispatchEvent(e);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function injectData(data) {
  console.log(data.data[1].length);
  var x_ruleName = data.data[0];
  var x_the_ipadders = data.data[1];
  var elm = document.querySelectorAll(".gtm-sheet")[2];
  console.log(elm.querySelectorAll("input")[0]);
  console.log(elm.querySelectorAll("input")[1]);
  console.log(elm.querySelectorAll("input")[2]);
  console.log(elm.querySelector("button.hide-read-only.btn.vt-st-add"));
  console.log(elm.querySelector(".btn.btn--filled.wd-editor-save"));
  //document.querySelectorAll('input[placeholder="Example: Corporate headquarters"]')[0].value = x_ruleName;
  //document.querySelector('input[placeholder="Example: Corporate headquarters"]').click();
  elm.querySelectorAll("input")[0].click();
  x_ruleName.split("").forEach((letter) => {
    //typeInto(document.querySelector('input[placeholder="Example: Corporate headquarters"]'), letter);
    typeInto(elm.querySelectorAll("input")[0], letter);
  });

  //document.querySelector('.show-read-only.blg-value').innerHTML = x_ruleName;
  //elm.querySelectorAll("input")[1].click()

  //x_ruleName.split('').forEach(letter => {
  //typeInto(elm.querySelectorAll("input")[1], letter);

  //})

  if (x_the_ipadders.length != 0) {
    x_the_ipadders.forEach((x, i) => {
      console.log("III" + i);
      // console.log(data.data[1])
      // console.log(data.data[1].shift())
      // console.log(data.data[1])

      elm.querySelectorAll("input")[i + 2].click();
      var ip = x.cidr.toString();
      if (i < 10) {
        x.cidr.split("").forEach((letter) => {
          typeInto(elm.querySelectorAll("input")[i + 2], letter);
        });
        //document.querySelectorAll('ctui-text-input input[placeholder*="Example: 192."]')[i].value = x.value;
        //document.querySelectorAll('.show-read-only.blg-body')[i + 1 + i].innerHTML = x.value;

        if (i != x_the_ipadders.length - 1) {
          elm.querySelector("button.hide-read-only.btn.vt-st-add").click();
        }
      } else {
        i = 0;
        // data.data[1].splice(0,10);
        let CopeiedAcc = data.data[0];
        let CopeiedData = data.data[1].splice(10,);
        console.log("ee");
        console.log(CopeiedData);
        chrome.storage.local.clear();
        chrome.storage.local.set({ data: [CopeiedAcc, CopeiedData] },
          function () {
            chrome.runtime.sendMessage({
              action: "pData",
              data: [CopeiedAcc, CopeiedData],
            });
          }
        );
        return;
      }
    });

    i = 0;
    //await sleep(500);
    //document.querySelector('.btn.btn--filled.wd-editor-save').click();
  }
}

function paste() {
  chrome.storage.local.get(["data"], function (result) {
    injectData(result);
  });
}
