// Javascript for the search function
// Uses jquery commands (linked to the jquery file in the js folder)
//initiate database located inside the browser (application within browser)
function initDB(){
    var db = getCurrentDB();
    if(!db){
        alert('Your browser does not support local HTML database');
        return ;
    } 
    // If the browser supports the html database, continue command:
    db.transaction(function(trans){
        trans.executeSql('CREATE TABLE if not exists Demo(_name text, category1 text, category2 text)',
                [],
                // inserting a table into the database named "Demo" with column
                function(trans,result){
                  console.log('init database success');
                  //show record in the console log whether the initiation of database was succesful
                },
                function(trans,message){
                  console.error('init database error');
                }
        );
    })
}
//insert some data to database
function insertToDemo(_name, category1, category2){
  var db = getCurrentDB();
  if(!db)   return;
  db.transaction(function(trans){
      trans.executeSql('insert into Demo(_name, category1, category2) values(?,?,?)',
      [_name,category1,category2],
      function(ts,data){
        console.info('insert success! ' + _name);
      },
      function(ts,message){
          console.error('insert ' + _name + ' error: ' + message.message);
      }
    )
  })
}
//delete database
function deleteTable(){
    var db = getCurrentDB();
    if(!db)   return;
    db.transaction(function(trans){
        trans.executeSql('DELETE FROM Demo',
                [],
                function(trans,result){
                  console.log('delet table demo success');
                },
                function(trans,message){
                  console.log('delete table demo error');
                }
        );
    })
}

// get database
function getCurrentDB(){
    var db = openDatabase('data.db','1.0','This is the demo database',1024*1024);
    return db;
}

// Handle search
function searchHandler(){
  var search_cond = $('input[name="search"]').val();        //get category1 condition
  if(!search_cond || search_cond=='')   return;
  localStorage.clear();
  search_cond = search_cond.toLowerCase();
  var db = getCurrentDB();
  db.transaction(function(trans){
      trans.executeSql('select * from Demo WHERE _name = ? or category1 = ? or category2 = ?',
        [search_cond, search_cond, search_cond],
        function(ts,data){
          localStorage.setItem('searchResult', JSON.stringify(data.rows));

          let searchPath = 'search.html';
          console.warn(window.location.href);
          if (window.location.href.includes('subcategories')) {
            searchPath = '../' + searchPath;
          }
          window.location.href = searchPath;
        },function(ts,message){
            alert(message.message);
        }
      );
  });
};

$(function(){
    //init
    initDB();
    deleteTable();
    //when you finish initing table, init some data
    insertToDemo('2000.jpg', '2000', 'birthday');
    insertToDemo('2004.jpg', 'nicole', 'trip');
    insertToDemo('birthday.jpg', 'birthday', 'jeffrey');
    insertToDemo('christmas.jpg', 'christmas', 'nicole');
    insertToDemo('jeffbirthday.jpg', 'birthday', 'jeffrey');
    insertToDemo('jefffriends.jpg', 'jeffrey', 'trip');
    insertToDemo('jeffnicolemount.jpg', 'jeffrey', 'nicole');
    insertToDemo('nicole2002.jpg', 'nicole', '2002');
    insertToDemo('nicole2003.jpg', 'nicole', '2003');
    insertToDemo('nicolechristmas.jpg', 'nicole', 'christmas');
    insertToDemo('nicolejeff.jpg', 'nicole', 'jeffrey');
    insertToDemo('parrot.jpg', 'nicole', 'jack');
    insertToDemo('people.jpg', 'jeffrey', 'trip');
    insertToDemo('schooltrip.jpg', 'nicole', 'trip');
    insertToDemo('ski.jpg', 'jeffrey', 'jack');
    insertToDemo('snow.jpg', 'jeffrey', 'snow');
    insertToDemo('snowjeff.jpg', 'jeffrey', 'snow');
    insertToDemo('year.jpg', 'jeffrey', 'christmas');
    insertToDemo('zoo.jpg', 'nicole', 'zoo');
    insertToDemo('zoo1.jpg', 'nicole', 'zoo');
    insertToDemo('zoo2.jpg', 'nicole', 'zoo');
    insertToDemo('zoonicole.jpg', 'nicole', 'zoo');

    $('input[name="search"]').val('');

    //search pics
    $('#search').unbind('click').bind('click', searchHandler);
    $('#searchInput').keydown((event) => {
      // execute search on Enter (13 represents enter key on keyboard)
      if (event.which === 13) {
        console.warn('handling search');
        searchHandler();
      }
    });
});
