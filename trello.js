//初期状態のタスク管理ボード用JSONデータ
const defaultBoards = [
    {
        "id": "sample-board-1",
        "title": "タスク",
        "class": "task",
        "dragTo": ['sample-board-2', 'sample-board-3'], 
        "item": [
            { "title": "報告書の作成" },
            { "title": "14時から打ち合わせ" }
        ]
    },
  
    {
        "id": "sample-board-2",
        "title": "進行中",
        "class": "progress",
        "item": [{ "title": "○○案の企画書作成" }]
    },
  
    {
        "id": "sample-board-3",
        "title": "完了",
        "class": "done",
        "item": [{"title": "日報の提出", "date": "aaa"}]
    }
];
   
  
//jKanbanのインスタンス作成
const kanban = new jKanban({
    element         : '#taskboard',  //タスク管理ボードを表示するHTML要素
    gutter          : '15px',       //ボード同士の間隔
    widthBoard      : '300px',      //ボードのサイズ
    boards          : defaultBoards,//初期状態のJSONデータ
    addItemButton   : true,         //タスク追加用のボタンを表示
    //click: (elem) => kanban.removeElement(elem),
    click: (elem) => removeFormElement(elem),
    buttonClick: (elem, id) => addFormElement(id), //タスク追加用の関数を指定
    dropEl: (elem, target, source, sibling)=> dargstart(elem,target)
});


const boardparent = document.getElementById("taskboard"); 
//console.log(boardparent.childNodes[0].childNodes[1].childNodes[0].childNodes[1]);
//boardparent.removeChild(boardparent.childNodes[0].childNodes[1].childNodes[0].childNodes[1]);
boardparent.getElementsByTagName('button')[2].remove();
boardparent.getElementsByTagName('button')[1].remove();
    

//タスク追加用の関数
function addFormElement(id) {
    if(id === "sample-board-1"){
    const formItem = document.createElement('form');
  
    formItem.innerHTML = '<input type="text">';  //タスクを追加するための入力ボックスを作成
    kanban.addForm(id, formItem);  //入力ボックスをボードに追加
  
    //タスクを登録する時のイベント処理
    formItem.addEventListener('submit', (e) => {
        e.preventDefault();

        //日時の取得
        var today=new Date();
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        var week = today.getDay();
        var day = today.getDate();
        var hour = today.getHours()
        var minute = today.getMinutes()
        var week_ja= new Array("日","月","火","水","木","金","土");   

        kanban.addElement(id, {"title": e.target[0].value, "date": "追加日 ： "+year+"年"+month+"月"+day+"日 "+week_ja[week]+"曜日 "+hour+"時"+minute+"分"}); //入力された文字列をタスクとして登録
        formItem.parentNode.removeChild(formItem); //入力ボックスを非表示にするために削除
    }) 
}
}   


//タスク削除用の関数
var clickCount = 0 ;
function removeFormElement(elem) {
    console.log(elem);
    
    // シングルクリックの場合
    if( !clickCount) {
        ++clickCount ;
        taskDisply(elem);
        setTimeout( function() {
            clickCount = 0 ;
            
        }, 350 ) ;

    // ダブルクリックの場合
    } else {
        if(document.getElementById('taskTitle')){
            const tasktitle = document.getElementById('taskTitle');  
            const taskdetail = document.getElementById('taskDetail');
            const tasktime = document.getElementById('taskTime');
            const taskdate = document.getElementById('taskDate');
            taskwindow.removeChild(tasktitle);
            taskwindow.removeChild(taskdetail);
            taskwindow.removeChild(tasktime);
            taskwindow.removeChild(taskdate);
        }
        kanban.removeElement(elem);
        clickCount = 0 ;
    }

}

var hour = "0";
var min = "0";
var sec = "0";

//タスクウィンドウの生成  
const taskwindow=document.getElementById('taskwindow'); 
function taskDisply(elem) {
    if(document.getElementById('taskTitle')){
        const tasktitle = document.getElementById('taskTitle');  
        const taskdetail = document.getElementById('taskDetail');
        const tasktime = document.getElementById('taskTime');
        const taskdate = document.getElementById('taskDate');
        taskwindow.removeChild(tasktitle);
        taskwindow.removeChild(taskdetail);
        taskwindow.removeChild(tasktime);
        taskwindow.removeChild(taskdate);
    }
    const childtitle = document.createElement("div");
    childtitle.id = "taskTitle";
    childtitle.className = "taskTitle";
    const childdetail = document.createElement("div");
    childdetail.id = "taskDetail";
    childdetail.className = "taskDetail";
    const childtime = document.createElement("div");
    childtime.id = "taskTime";
    childtime.className = "taskTime";
    const childdate = document.createElement("div");
    childdate.id = "taskDate";
    childdate.className = "taskDate";

    const title = document.createElement("p");
    title.innerText = elem.innerText;
    title.className = "title";
    const title_edit_button = document.createElement("button");
    title_edit_button.innerText = "編集";
    title_edit_button.className = "title_button";


    const detail_edit_button = document.createElement("button");
    detail_edit_button.innerText = "編集";
    detail_edit_button.className = "detail_button";

    const time = document.createElement("p");
    time.innerText = "タスク経過時間 : "+hour+':'+min+':'+sec;

    const date = document.createElement("p");
    date.innerText = elem.dataset.date;

    childtitle.appendChild(title);
    childtitle.appendChild(title_edit_button);
    childdetail.appendChild(detail_edit_button);
    childtime.appendChild(time);
    childdate.appendChild(date);

    taskwindow.appendChild(childtitle);
    taskwindow.appendChild(childdetail);
    taskwindow.appendChild(childtime);
    taskwindow.appendChild(childdate);

}; 

function dargstart(el, target){
    var starttime;
    if(target.parentElement.getAttribute('data-id')=='sample-board-2'){
        starttime = Date.now();
        //console.log(el);
        startwatch(el,starttime);
    }else if(target.parentElement.getAttribute('data-id')=='sample-board-3'){
        clearTimeout(timerId);
    }
}

var time;
var timerId;
var restarttime = 0;
function startwatch(el, starttime){
    //var starttime;
    timecount();
    function timeConversion(){
        var hour = Math.floor(time/1000/60/60);
        var min = Math.floor((time/60/1000)%60);
        var sec = Math.floor((time/1000)%60);
        console.log(el);
        console.log(hour+':'+min+':'+sec);
    }
    function timecount(){
        timerId = setTimeout(function(){
            time = Date.now() - starttime + restarttime;
            timeConversion();
            timecount();
        },1000);
    }
}