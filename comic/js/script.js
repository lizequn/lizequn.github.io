
var id_eye = 0;
var id_mouth = 0;
var bool_draw_face


function loadpage_home(){
    // config = JSON.parse("config2.json");
    // config =require("config2.json");

    // fs.readFile("config2.json", function (error, content) {
    //     config = JSON.parse(content);
    //     console.log(config.collection.length);
    // });

    var targetelement= document.getElementById("char_bg_panel");

    //add face choices
    create_choices(targetelement , "char_panel", "char_info", config ,"characters", key_l1 = 'face');
    create_choices(targetelement , "bg_panel", "bg_info", config ,"backgrounds");
    
    function create_choices(targetelement,div_id, label_name, config, choice_type, key_l1 = null){
        var length = Object.keys(config[choice_type]).length;
        var div = document.createElement("div");
        div.id = div_id;
        // div.style.width = "100%";

        for (i=0;i<length; i++){
            var label = document.createElement("label");
            key = Object.keys(config[choice_type])[i];

            if(key_l1=='face'){
                //old version actual face
                // var filename = config[choice_type][key][key_l1]['filename'];
                // thumbnail filenames
                var filename = config[choice_type][key][key_l1]['thumbnail'];
                var folder = config["folder"] + config[choice_type][key]['subfolder'];

            }else if (key_l1==null){
                var filename = config[choice_type][key]['filename'];
                var folder = config["folder"] + config[choice_type][key]['subfolder'];
            }else{
                alert("config file error");
            }
        

            // console.log(characters["1"])
            if(i==0){
                label.innerHTML = "<input type=\"radio\" name=" + label_name+ " value=" + key +
                " checked> <img src=" + folder + filename + " name=" + label_name+ " value=" + key + 
                " class=\"choice_img\"  onclick=select_char_or_bg(this) style=\"padding:0px 5px;\">";
            }else{
                label.innerHTML = "<input type=\"radio\" name=" + label_name+ " value=" + key +
                " unchecked> <img src=" + folder + filename + " name=" + label_name+ " value=" + key + 
                " class=\"choice_img\"  onclick=select_char_or_bg(this) style=\"padding:0px 5px;\">";
            }

            // canvas label version
            // if(i==0){
            //     label.innerHTML = "<input type=\"radio\" name=" + label_name+ " value=" + key +
            //     " checked> <canvas id=" +label_name+key+" class=\"choice_canvas\" value=" + key + 
            //     " onclick=select_char_or_bg(this)></canvas>"
            // }else{
            //     label.innerHTML = "<input type=\"radio\" name=" + label_name+ " value=" + key +
            //     " unchecked> <canvas id=" +label_name+key+ " class=\"choice_canvas\" value=" + key + 
            //     " onclick=select_char_or_bg(this)></canvas>"
            // }

            // var tn =new Image();
            // tn.onload = img_onload;
            // function img_onload(){
            //     var canvas = document.getElementById(label_name+key);
            //     var context = canvas.getContext("2d");
            //     context.canvas.width  = tn.width;
            //     context.canvas.height = tn.height;
            //     context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            //     context.drawImage(tn, 0, 0 );
            // };
            // tn.src = folder + filename

            div.appendChild(label);
        }
        
        targetelement.appendChild(div);
    }
    select_char_or_bg('init');
}


function build_expression(filename){

    // show_image(src, 276,110, "Google Logo");
    var root_folder = config['folder'];
    var subfolder = config['characters'][char_key]['subfolder']

    if(subfolder == "None"){
        var folder  =root_folder;
    }else{
        var folder  =root_folder + subfolder;
    }

    eye_folder = folder +'face_parts/';
    mouth_folder = folder +'face_parts/';

    face = document.createElement("img");
    face.src = folder + filename;

    // eyes
    eye = document.createElement("img");
    // eye.src = eye_folder + l_eye[0]['filename']; // older version config using 'filename'
    eye.src = eye_folder + l_eye[0]['face_filename'];

    var eye_x_offset= l_eye[0]['x_offset_face'];
    var eye_y_offset= l_eye[0]['y_offset_face'];

    id_eye = 0;
    
    //mouths
    mouth = document.createElement("img");
    // mouth.src = mouth_folder + l_mouth[0]['filename'];  // older version config using 'filename'
    mouth.src = mouth_folder + l_mouth[0]['face_filename'];

    var m_x_offset= l_mouth[0]['x_offset_face'];
    var m_y_offset= l_mouth[0]['y_offset_face'];

    id_mouth = 0;

    load_img_cnt=0;

    var onImgLoad = function()
    {
        load_img_cnt++;
        if(load_img_cnt == 3){
            // draw_face();
            // draw_parts(targetelement , eye, ratio, eye_x_offset , eye_y_offset,"img_eye");
            // draw_parts(targetelement , mouth, ratio, m_x_offset , m_y_offset, "img_mouth");

            draw_face_canvas();
        }

    };

    face.onload = onImgLoad;
    eye.onload = onImgLoad;
    mouth.onload = onImgLoad;


    
}


function draw_face_canvas(){

    var circle_canvas = document.getElementById("face_canvas");
    var context = circle_canvas.getContext("2d");

    // context.canvas.width  = window.innerWidth*0.75;
    // context.canvas.height = window.innerHeight*0.75;

    context.canvas.width  = 1000;
    context.canvas.height = 1000;

    console.log("Canvas figure size: "+context.canvas.width +" x " + context.canvas.height);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);



    console.log("character face size: "+face.width +" x " + face.height);
    context.drawImage(face,0 ,0 );
    context.drawImage(eye ,0,0);
    context.drawImage(mouth,0,0);

};



function move_eye(next){
    //remove previous eyes
    // document.getElementById("img_eye").remove();
    //choose the next/prev eye
    id_eye = prev_next_id(id_eye, l_eye.length,  next);

    eye = document.createElement("img");


    
    // eye.src = eye_folder +  l_eye[id_eye]['filename']; // older version config using 'filename'
    eye.src = eye_folder +  l_eye[id_eye]['face_filename'];
    var eye_x_offset= l_eye[id_eye]['x_offset_face'];
    var eye_y_offset= l_eye[id_eye]['y_offset_face'];

    eye.onload = function () {
        //TODO read the jason in when the page is loaded.
        // draw_parts(targetelement , eye, ratio,
        //      eye_x_offset , eye_y_offset, "img_eye")

        draw_face_canvas();

    };
}

function move_mouth(next){
    // document.getElementById("img_mouth").remove();
    id_mouth = prev_next_id(id_mouth, l_mouth.length,  next);

    mouth = document.createElement("img");
    // mouth.src = mouth_folder + l_mouth[id_mouth]['filename'];  // older version config using 'filename'
    mouth.src = mouth_folder + l_mouth[id_mouth]['face_filename'];

    var m_x_offset= l_mouth[id_mouth]['x_offset_face'];
    var m_y_offset= l_mouth[id_mouth]['y_offset_face'];

    //get the offset from json.
    mouth.onload = function () {
        //TODO read the jason in when the page is loaded.
        // draw_parts(targetelement , mouth, ratio,
        //      m_x_offset , m_y_offset, "img_mouth")
        draw_face_canvas();

    };
}


function prev_next_id(idx, length,next){
    if(next ==true){
        idx++;
        if (idx>=length){
            idx=0;
        }
    }else{
        idx--;
        if (idx<0){
            idx=length-1;
        }
    }
    return idx;
};


function draw_parts(targetelement, img, ratio, x_offset,y_offset, id_name  ){
    img.id = id_name;
    
    console.log(id_name + " img size: "+img.width +" x " + img.height);
    img.width = img.width * ratio;
    img.height = img.height * ratio;
    console.log(id_name + " img scaled size: "+img.width +" x " + img.height);

    img.style.position = "absolute"
    // img.style.left = x_offset * ratio * svg_resize_scale+'px';
    // img.style.top = y_offset * ratio * svg_resize_scale+'px'; 

    img.style.left = '0px';
    img.style.top = '0px'; 

    targetelement.appendChild(img);
};



// function open_comic(){
//     var ele = document.getElementsByName('bg_info');
//     localStorage.setItem("bg_key", get_choice(ele));

//     var ele = document.getElementsByName('char_info');
//     localStorage.setItem("char_key", get_choice(ele));

//     localStorage.setItem("id_eye", id_eye);
//     localStorage.setItem("id_mouth", id_mouth);
//     window.location.href = 'comic.html';
    
// }

//-------------Functions for drawing comic-------------.



function loadpage(){

    // var bg_name =  localStorage.getItem("bg_name")
    // add_bg_with_name(bg_name);
    // add_bg_char_to_canvas();

    load_comic(load_from_gallery=false, add_text=false)
}
var bg = new Image();
var char = new Image();
var eye = new Image();
var mouth = new Image();
var dialog = new Image();
var global_text = '';
var imagesLoaded = 0;


// var comic_limit=2;
var comic_config=[];
var current_mini_canvas = -1;
var bubble_key='None';

function add_to_gallery(){

    if(global_text ==''){
        alert("A dialog need to be added before adding the comic to gallery.");
    }else {
        
        // adding comic to canvas
        var canvas = document.createElement('canvas');
    
        var mini_canvas_idx = comic_config.length+1;
        canvas.id = "mini_canvas_" + mini_canvas_idx;
        canvas.className = 'mini_canvas';
    
        canvas.style.backgroundColor =  "rgb(215, 214, 218)";
        // canvas.style.padding = "35px";
        canvas.style.margin= "5px";
        var div = document.getElementById('gallery');
        div.appendChild(canvas)


        comic_config.push({"text":global_text, "bg_key":bg_key,"char_key":char_key,"id_eye":id_eye,
            "id_mouth":id_mouth})
        draw_character(canvas.id ,bg, char,eye,mouth, char_key , global_text , dialog ,bubble_key)
        
        // Redraw the main canvas and reset the dialog
        clean_textarea();
        draw_character("canvas",bg, char,eye,mouth, char_key)
    }
    canvas.style.width="20%";
    canvas.style.height="20%";
}

// select and highlight gallery canvas
// The main canvas will draw the selected comic.
var hilightElement = function(e) {
    var event = e || window.event;

    // this is the element you want:
    var target = e.target || e.srcElement;
    console.log(target.id)


    current_mini_canvas=-1
    var list_mini_canvas = document.getElementsByClassName("mini_canvas");
    for (var i=0; i<list_mini_canvas.length;i++){
        list_mini_canvas[i].style.outline = "";
    }
    
    if (target.className =="mini_canvas"){

        current_mini_canvas = target.id[target.id.length-1];
        if(current_mini_canvas<=comic_config.length){
        target.style.outline = "solid blue 5px";    
        // redraw_from_gallery();

        load_comic(init=false,load_from_gallery=true,add_text=true)
        }
    }
    
    
};

if (document.addEventListener){
    document.addEventListener('click', hilightElement, false);
} else if (document.attachEvent){
    document.attachEvent('onclick', hilightElement);
}






function countChar(val) {
    var len = val.value.length;
    // if (len >= 20) {
    //   val.value = val.value.substring(0, 500);
    // } else {

    max_length = document.getElementById("area1").maxLength;
      $('#charNum').text(len+"/"+max_length);
    // }
  };




//------------


//actions for selecting characters and backgrounds
// Draw comic on the comic panel.
function select_char_or_bg(ele){


    
    if(ele.name == "bg_info"){
        
        var p =ele.parentNode;
        var children = p.children;
        bg_key = children[0].value;
        char_key = get_choice(document.getElementsByName('char_info'));
        console.log("selected "+ ele.value + " char value=" + char_key+ " bg value=" + bg_key);
    }else if(ele.name == 'char_info'){

        var p =ele.parentNode;
        var children = p.children;
        char_key = children[0].value;
        bg_key = get_choice(document.getElementsByName('bg_info'));
        console.log("selected "+ ele.value + " char value=" + char_key+ " bg value=" + bg_key);
    }else if(ele == 'init'){
        char_key = get_choice(document.getElementsByName('char_info'));
        bg_key = get_choice(document.getElementsByName('bg_info'));
    }else{
        alert("error");
    }

    // if(ele.name == "bg_info" |ele.name == "char_info"  | ele == 'init'){
        
    //     char_key = get_choice(document.getElementsByName('char_info'));
    //     bg_key = get_choice(document.getElementsByName('bg_info'));

    // }else{
    //     alert("error");
    // }


    // if(ele.className == "choice_canvas" | ele == 'init'){
        
    //     char_key = get_choice(document.getElementsByName('char_info'));
    //     bg_key = get_choice(document.getElementsByName('bg_info'));

    //     console.log(" char value=" + char_key+ " bg value=" + bg_key);
    // }else{
    //     alert("error");
    // }

   

    console.log("Char, bg choices:" + " char:" +char_key+ " bg:" + bg_key )

    load_comic(init=true,load_from_gallery=false, add_text=true)
    // init_comic()

    // document.getElementById("bg_info").disabled = true;  
    // document.getElementById("char_info").disabled = true;  
}


    
function remove_dialog(){
    //use the current eye mouth to draw
    draw_character("canvas" ,bg, char,eye,mouth, char_key );
    // clean the text area
    clean_textarea();

}

function clean_textarea(){
    document.getElementById('area1').value = '';
    global_text ='';
    var word_count = document.getElementById('charNum');
    word_count.innerHTML = "0/240";
}

// TODO edit expression based on the current face, rather than the selected face。
function edit_expression(){

    var root_folder = config['folder'];
    var subfolder = config['characters'][char_key]['subfolder']

    if(subfolder == "None"){
        var folder  =root_folder;
    }else{
        var folder  =root_folder + subfolder;
    }
    var parts_folder = folder + 'figure_parts/';

    eye.src= parts_folder + config['characters'][char_key]['eyes'][id_eye]['figure_filename']; 
    mouth.src= parts_folder + config['characters'][char_key]['mouth'][id_mouth]['figure_filename'];

    eye.onload = img_onload;
    mouth.onload = img_onload;
    
    // dialog.onload = img_onload;
    imagesLoaded = 0;
    function img_onload(){
        imagesLoaded++;
        if(imagesLoaded == 2){
            if(global_text==""){
                draw_character("canvas" ,bg, char,eye,mouth, char_key );
            }
            else{
                draw_character("canvas" ,bg, char,eye,mouth, char_key , global_text , dialog ,bubble_key);
            }
            
        }
    };

    overlay_off()
}

function load_comic(init = false, load_from_gallery=false, add_text=false){
    // ======= Get the char, bg, eye, mouth info from the gallery
    imagesLoaded = 0;
    bg.onload = img_onload;
    char.onload = img_onload;
    eye.onload = img_onload;
    mouth.onload = img_onload;

    // == get the keys of char, bg, eye, mouth
    if(init){
        id_eye = 0;
        id_mouth = 0;
    }else if(!load_from_gallery){
        bg_key = localStorage.getItem("bg_key");
        char_key = localStorage.getItem("char_key");
        id_eye = localStorage.getItem("id_eye");
        id_mouth = localStorage.getItem("id_mouth");
    }else{
        bg_key = comic_config[current_mini_canvas-1]["bg_key"]
        char_key = comic_config[current_mini_canvas-1]["char_key"];
        id_eye = comic_config[current_mini_canvas-1]["id_eye"];
        id_mouth = comic_config[current_mini_canvas-1]["id_mouth"];
    }


    var root_folder = config['folder'];
    var subfolder = config['characters'][char_key]['subfolder']
    var bg_folder = root_folder +  config['backgrounds'][bg_key]['subfolder'];
    if(subfolder == "None"){
        var folder  =root_folder;
    }else{
        var folder  =root_folder + subfolder;
    }
    var parts_folder = folder + 'figure_parts/';
    bg.src = bg_folder + config['backgrounds'][bg_key]['filename'];
    char.src = folder + config['characters'][char_key]['figure']['filename'];
    eye.src= parts_folder + config['characters'][char_key]['eyes'][id_eye]['figure_filename']; 
    mouth.src= parts_folder + config['characters'][char_key]['mouth'][id_mouth]['figure_filename'];

    if(add_text){
        if(!load_from_gallery){
            global_text= document.getElementById('area1').value;
        }else{
            global_text= comic_config[current_mini_canvas-1]["text"];
        }
        
        //Remove all the new lines.
        global_text = global_text.replace(/\n\s*\n/g, ' ');
        //remove multiple white space
        global_text = global_text.replace(/\s+/g, " ");
        global_text = global_text.trim();

        n_char = global_text.length;
        if(n_char>0 & n_char<20){
            bubble_key='small';
        }else if (n_char<102){
            bubble_key='medium';
        }else if (n_char<175){
            bubble_key='large';
        }else{
            bubble_key='long';
        }
        // bubble_key = bubble_keys[bubble_id];
        var bubble_folder = config['folder'] + config['speech_bubbles']['subfolder'];
        dialog.src = bubble_folder + config['speech_bubbles'][bubble_key]['filename'];
        dialog.onload =img_onload;



    }

    // ======= Onload functions
    function img_onload(){
        imagesLoaded++;
        if(global_text==""){
            if(imagesLoaded == 4){
                draw_character("canvas" ,bg, char,eye,mouth, char_key );
            }
        }else{
            if(imagesLoaded == 5)
            draw_character("canvas" ,bg, char,eye,mouth, char_key , global_text , dialog ,bubble_key);
        }

    };

}

function draw_character(canvas_id ,bg, char,eye,mouth, char_key , text='' , dialog ,bubble_key){
    console.log("==== Drawing Comic ====");
    var circle_canvas = document.getElementById(canvas_id);
    var context = circle_canvas.getContext("2d");

    //update the canvas as the background's width and heighy
    context.canvas.width  = bg.width;
    context.canvas.height = bg.height;

    console.log("Canvas figure size: "+context.canvas.width +" x " + context.canvas.height);
    context.clearRect(0, 0,context.canvas.width, context.canvas.height);


    console.log("Background figure size: "+context.canvas.width +" x " + context.canvas.height);
    context.drawImage(bg, 0, 0 , context.canvas.width, context.canvas.height);


    x_char=config['characters'][char_key]['figure']['x_offset_from_bg'];
    y_char=config['characters'][char_key]['figure']['y_offset_from_bg'];

    var width_char = config['characters'][char_key]['figure']['width'];
    var height_char = config['characters'][char_key]['figure']['height'];


    console.log("character figure size: "+char.width +" x " + char.height);
    console.log("character figure  x: "+x_char +", y: " + y_char);
    context.drawImage(char, x_char, y_char,width=width_char, height=height_char);

    
    x_eye = x_char;
    y_eye = y_char;


    x_mouth = x_char;
    y_mouth = y_char;

    console.log("eye size: "+eye.width +" x " + eye.height);
    console.log("mouth size: "+mouth.width +" x " + mouth.height);

    context.drawImage(eye, x_eye, y_eye,width=width_char, height=height_char);
    context.drawImage(mouth, x_mouth, y_mouth,width=width_char, height=height_char);


    //Draw and dialog text
    if(text !=''){
        draw_dialog(context, dialog, text, bubble_key)
    }
}


function draw_gallery(canvas_id ,bg, char,eye,mouth, char_key , text='' , dialog ,bubble_key){
    console.log("==== Drawing Comic ====");
    var circle_canvas = document.getElementById(canvas_id);
    var context = circle_canvas.getContext("2d");

    //update the canvas as the background's width and height

    var old_bg_width = bg.width;
    var old_bg_height = bg.height;

    

    bg.width = context.canvas.width ;
    bg.height = context.canvas.height;

    var ratio = calculateAspectRatio(old_bg_width,old_bg_height , bg.width ,bg.height);

    console.log("Canvas figure size: "+context.canvas.width +" x " + context.canvas.height);
    context.clearRect(0, 0,context.canvas.width, context.canvas.height);


    console.log("Background figure size: "+context.canvas.width +" x " + context.canvas.height);
    context.drawImage(bg, 0, 0 , context.canvas.width, context.canvas.height);


    x_char=config['characters'][char_key]['figure']['x_offset_from_bg'] * ratio;
    y_char=config['characters'][char_key]['figure']['y_offset_from_bg']* ratio;

    var width_char = config['characters'][char_key]['figure']['width']* ratio;
    var height_char = config['characters'][char_key]['figure']['height']* ratio;


    console.log("character figure size: "+char.width +" x " + char.height);
    console.log("character figure  x: "+x_char +", y: " + y_char);
    context.drawImage(char, x_char, y_char,width=width_char, height=height_char);

    
    x_eye = x_char* ratio;
    y_eye = y_char* ratio;


    x_mouth = x_char* ratio;
    y_mouth = y_char* ratio;

    console.log("eye size: "+eye.width +" x " + eye.height);
    console.log("mouth size: "+mouth.width +" x " + mouth.height);

    context.drawImage(eye, x_eye, y_eye,width=width_char, height=height_char);
    context.drawImage(mouth, x_mouth, y_mouth,width=width_char, height=height_char);


    //Draw and dialog text
    if(text !=''){
        draw_dialog(context, dialog, text, bubble_key)
    }
}

function draw_dialog(context, dialog, text, bubble_key){
    var font = 32;
    console.log("Use speech bubble:" +bubble_key );
    var bubble_x_offset= config['speech_bubbles'][bubble_key]['x_offset_background'];
    var bubble_y_offset= config['speech_bubbles'][bubble_key]['y_offset_background'];

    var bubble_width = config['speech_bubbles'][bubble_key]['width'];
    var bubble_height = config['speech_bubbles'][bubble_key]['height'];
    context.drawImage(dialog, bubble_x_offset, bubble_y_offset, width = bubble_width, height = bubble_height);
    


    // bubble_type='medium';
    if(bubble_key=='large'){
        n_char_per_line = 25;
    }else if(bubble_key=='medium'){
        n_char_per_line = 17;
    }else if(bubble_key=='long'){
        n_char_per_line = 60;
    }else if(bubble_key=='small'){
        n_char_per_line = 8;
    }


    
    
    // text_array =  foldRgx(text, n_char_per_line);
    var text_array =  fold_text_to_lines(text, n_char_per_line);

    // new_text = text_array.join('\n');

    console.log("displaying text with font size: " + font)
    console.log("Characters per line: " + n_char_per_line)
    console.log("Lines: " + text_array.length)

    // x_dia = x_char 
    // y_dia = y_char 

    var x_text = bubble_x_offset + config['speech_bubbles'][bubble_key]['x_offset_text'];
    var y_text = bubble_y_offset + config['speech_bubbles'][bubble_key]['y_offset_text'];
    
    // dia_width =  font * 0.5  * n_char_per_line;
    // dia_height=40* (text_array.length-1);
    // context.drawImage(dialog, x_dia, y_dia, dw =dia_width, dh =dia_height);
    // context.lineWidth = 1;
    // context.fillStyle = "#CC00FF";
    // context.lineStyle = "#ffff00";
    
    context.font = font+"px sans-serif";

    lineheight=font* 0.9;
    for (var i = 0; i<text_array.length; i++){
        context.fillText(text_array[i], x_text, y_text+ font + (i*lineheight) );
    }


}

function build_structure_string(structure_array){
    var comic_structure = ""
    for(const ele of structure_array){
        comic_structure+= ele.getAttribute('src')+",";
    }
    return comic_structure;
}

async function get_recommendation(text,structure){
    let url = "http://128.199.57.220/api/comic"
    // let url = "http://127.0.0.1:5000/comic";
    const response = await fetch(url,{
        method:"POST",
        // mode:"no-cors",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            comic_name: "test",
            comic_structure: structure,
            comic_script: text
        })
    });
    return response.json();
}

function show_recommendation(data){
    var panel = document.getElementById('recommend_panel');
    panel.textContent = '';
    var h4 = document.createElement('h4');
    h4.innerHTML = "Suggest reading:";
    var ul = document.createElement('ul');
    ul.setAttribute('id','recom_list');
    panel.appendChild(h4);
    panel.appendChild(ul);
    data.forEach(renderSuggest);
    function renderSuggest(element,index,arr){
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('href',element['href']);
        a.setAttribute('target','_blank');
        a.innerHTML = element['name'];
        li.appendChild(a);
        ul.appendChild(li);
    }
}

function add_dialog() {
    // Draw Image function
    global_text= document.getElementById('area1').value
    
    //Remove all the new lines.
    global_text = global_text.replace(/\n\s*\n/g, ' ');
    //remove multiple white space
    global_text = global_text.replace(/\s+/g, " ");
    global_text = global_text.trim();
    const structure = build_structure_string([bg,char,eye,mouth]);
    get_recommendation(global_text,structure).then((data)=>{
        show_recommendation(data);
        console.log(data);
    });
    n_char = global_text.length;
    if(n_char>0 & n_char<20){
        bubble_key='small';
    }else if (n_char<102){
        bubble_key='medium';
    }else if (n_char<175){
        bubble_key='large';
    }else{
        bubble_key='long';
    }


    // bubble_key = bubble_keys[bubble_id];
    var bubble_folder = config['folder'] + config['speech_bubbles']['subfolder'];
    dialog.src = bubble_folder + config['speech_bubbles'][bubble_key]['filename'];


    dialog.onload =img_onload;

    function img_onload(){

        draw_character("canvas" ,bg, char,eye,mouth, char_key , global_text , dialog ,bubble_key);

    };
}




//-- helper functions--


  //
// Folds a string at a specified length, optionally attempting
// to insert newlines after whitespace characters.
//
// s          -  input string
// n          -  number of chars at which to separate lines
// useSpaces  -  if true, attempt to insert newlines at whitespace
// a          -  array used to build result
//
// Returns an array of strings that are no longer than n
// characters long.  If a is specified as an array, the lines 
// found in s will be pushed onto the end of a. 
//
// If s is huge and n is very small, this metho will have
// problems... StackOverflow.
//
function fold(s, n, useSpaces, a) {
    a = a || [];
    if (s.length <= n) {
        a.push(s);
        return a;
    }
    var line = s.substring(0, n);
    if (! useSpaces) { // insert newlines anywhere
        a.push(line);
        return fold(s.substring(n), n, useSpaces, a);
    }
    else { // attempt to insert newlines after whitespace
        var lastSpaceRgx = /\s(?!.*\s)/;
        var idx = line.search(lastSpaceRgx);
        var nextIdx = n;
        if (idx > 0) {
            line = line.substring(0, idx);
            nextIdx = idx;
        }
        a.push(line);
        return fold(s.substring(nextIdx), n, useSpaces, a);
    }
}

// Regex version of fold function.

function foldRgx(s, n) {
    var rgx = new RegExp('.{0,' + n + '}', 'g');
    return s.match(rgx);
}


function fold_text_to_lines(text, lower_bound) {
    var text_array = text.split(" ")

    

    var upper_bound=lower_bound + 5
    
    var text_len=0
    var result=''
    var result_list = []
    for (var i = 0; i<text_array.length; i++){
        if(result==''){
            var temp_result=result+text_array[i] 
        }else{
            var temp_result=result+" "+text_array[i] 
        }
        

        text_len=temp_result.length

        if(text_len>=upper_bound){
            // Very long word in the end of the line.
            text_len=0
            result_list.push(result);
            result = text_array[i] +" "
            temp_result=""

        }else if(text_len<lower_bound){
            //smaller than the lower bound of the length
            //keep adding
            result = temp_result;

        }else if(text_len<upper_bound & text_len>=lower_bound){
            //in the range of lower and upper
            //save this line
            result_list.push(temp_result);
            temp_result="";
            result=""
        }
    }

    result_list.push(result)

    return result_list

}

function calculateAspectRatio(srcWidth, srcHeight, maxWidth, maxHeight) {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    // return { width: srcWidth*ratio, height: srcHeight*ratio };
    return ratio;
 }
// download https://jsfiddle.net/user2314737/28wqq1gu/
 function download() {
    
    if(global_text ==''){
        alert("Only comic with dialog can be downloaded");
    }else{
        var canvas = document.getElementById("canvas");
        var img    = canvas.toDataURL("image/png");
        // document.write('<img src="'+img+'" crossorigin="anonymous"/ >');
        img = img.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        img = img.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Comic.png');
        const a = document.createElement('a');
        a.href = img;
        a.download = "comic.png";
        document.body.appendChild(a);
        a.click()
        document.body.removeChild(a);
    }
    


}




// functions not using

// function draw_face(){



//     // The scale of image from the read in size to the Illustrator size
//     ori_width = v_character['face']['width'];
//     ori_height = v_character['face']['height'];

//     svg_resize_scale= calculateAspectRatio(ori_width,ori_height, img.width,img.height );
//     // the scale of image to the canvas
//     ratio = calculateAspectRatio(img.width,img.height,targetelement.offsetWidth,targetelement.offsetHeight);
    
    

//     console.log("scale ratio for the face: "+ratio);

//     console.log("face img origin size: "+img.width +" x " + img.height);

//     img.width = img.width * ratio;
//     img.height = img.height * ratio;
//     console.log("face img scaled size: "+img.width +" x " + img.height);

//     //relative image size
//     // img.style.maxHeight = "100%";
//     // img.style.maxWidth = "100%";


//     // eye.width = eye.width * ratio;
//     // eye.height = eye.height * ratio;

//     // eye.id = "img_eye";
    
//     // eye.style.position = "absolute"
//     // eye.style.left = x_offset * ratio+'px';
//     // eye.style.top = y_offset * ratio+'px'; 

//     targetelement.appendChild(img);
// };



//Function used to draw the comic from comics in the gallery.
function redraw_from_gallery(){
    // ======= Get the char, bg, eye, mouth info from the gallery
    imagesLoaded = 0;
    bg.onload = img_onload;
    char.onload = img_onload;
    eye.onload = img_onload;
    mouth.onload = img_onload;
    
    bg_key = comic_config[current_mini_canvas-1]["bg_key"]
    char_key = comic_config[current_mini_canvas-1]["char_key"];
    id_eye = comic_config[current_mini_canvas-1]["id_eye"];
    id_mouth = comic_config[current_mini_canvas-1]["id_mouth"];

    var root_folder = config['folder'];
    var subfolder = config['characters'][char_key]['subfolder']
    var bg_folder = root_folder +  config['backgrounds'][bg_key]['subfolder'];
    if(subfolder == "None"){
        var folder  =root_folder;
    }else{
        var folder  =root_folder + subfolder;
    }
    var parts_folder = folder + 'figure_parts/';
    bg.src = bg_folder + config['backgrounds'][bg_key]['filename'];
    char.src = folder + config['characters'][char_key]['figure']['filename'];
    eye.src= parts_folder + config['characters'][char_key]['eyes'][id_eye]['figure_filename']; 
    mouth.src= parts_folder + config['characters'][char_key]['mouth'][id_mouth]['figure_filename'];



    // ======= Get the text from gallery and set the corresponding dialogue bubble.
    global_text = comic_config[current_mini_canvas-1]["text"]
    n_char = global_text.length;
    if(n_char>0 & n_char<20){
        bubble_key='small';
    }else if (n_char<102){
        bubble_key='medium';
    }else if (n_char<175){
        bubble_key='large';
    }else{
        bubble_key='long';
    }

    // bubble_key = bubble_keys[bubble_id];
    var bubble_folder = config['folder'] + config['speech_bubbles']['subfolder'];
    dialog.src = bubble_folder + config['speech_bubbles'][bubble_key]['filename'];


    dialog.onload =img_onload;

    // Img onload function when bg, char, eye, mouth, dialog (5 images) are all loaded
    function img_onload(){
        imagesLoaded++;
        if(imagesLoaded == 5){
            draw_character("canvas" ,bg, char,eye,mouth, char_key,  global_text,
            dialog ,bubble_key );
        }
    };
}



function init_comic(){

    
    bg.onload = img_onload;
    char.onload = img_onload;
    eye.onload = img_onload;
    mouth.onload = img_onload;
    
    // dialog.onload = img_onload;
    imagesLoaded = 0;
    function img_onload(){
        imagesLoaded++;
        if(imagesLoaded == 4){
            draw_character("canvas" ,bg, char,eye,mouth, char_key );

        }
    };


    //init the comic, so choose a default 
    id_eye = 0;
    id_mouth = 0;

    
    var root_folder = config['folder'];
    var subfolder = config['characters'][char_key]['subfolder']
    var bg_folder = root_folder +  config['backgrounds'][bg_key]['subfolder'];

    if(subfolder == "None"){
        var folder  =root_folder;
    }else{
        var folder  =root_folder + subfolder;
    }
    var parts_folder = folder + 'figure_parts/';

    bg.src = bg_folder + config['backgrounds'][bg_key]['filename'];
    char.src = folder + config['characters'][char_key]['figure']['filename'];
    eye.src= parts_folder + config['characters'][char_key]['eyes'][id_eye]['figure_filename']; 
    mouth.src= parts_folder + config['characters'][char_key]['mouth'][id_mouth]['figure_filename'];

    // clean the text area
    clean_textarea();
}



function add_bg_char_to_canvas(){
    // Draw Image function
    imagesLoaded = 0;
    bg.onload = img_onload;

    char.onload = img_onload;

    eye.onload = img_onload;

    mouth.onload = img_onload;
    
    // dialog.onload = img_onload;

    function img_onload(){
        imagesLoaded++;
        if(imagesLoaded == 4){
            draw_character("canvas" ,bg, char,eye,mouth, char_key );
        }
    };

    bg_key = localStorage.getItem("bg_key");
    char_key = localStorage.getItem("char_key");
    id_eye = localStorage.getItem("id_eye");
    id_mouth = localStorage.getItem("id_mouth");

    


    var root_folder = config['folder'];
    var subfolder = config['characters'][char_key]['subfolder']
    var bg_folder = root_folder +  config['backgrounds'][bg_key]['subfolder'];

    if(subfolder == "None"){
        var folder  =root_folder;
    }else{
        var folder  =root_folder + subfolder;
    }

    var parts_folder = folder + 'figure_parts/';

    bg.src = bg_folder + config['backgrounds'][bg_key]['filename'];
    char.src = folder + config['characters'][char_key]['figure']['filename'];

    //older version using 'filename'
    // eye.src= parts_folder + config['characters'][char_key]['eyes'][id_eye]['filename']; 
    // mouth.src= parts_folder + config['characters'][char_key]['mouth'][id_mouth]['filename'];

    eye.src= parts_folder + config['characters'][char_key]['eyes'][id_eye]['figure_filename']; 
    mouth.src= parts_folder + config['characters'][char_key]['mouth'][id_mouth]['figure_filename'];

    // window.addEventListener('resize', draw_canvas, false);
}