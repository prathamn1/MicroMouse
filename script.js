let visited,tr=-1,tc=-1,sr=-1,sc=-1,rows=-1,cols=-1,cell_size=-1,is_grid_generated=false;
const states={
    0:"empty",
    1:"blocked",
    2:"source",
    3:"target"
};
const dx=[0,0,1,-1];
const dy=[1,-1,0,0];




function show_path() {
    if(! is_grid_generated) {
        if(confirm('OOPS! Grid not generated Yet')===true) {
            generate_grid();
        }else {
            return;
        }
    }
    if(! visited[sr][sc]) alert('No Valid Path Found from Source to Target.');

    let curr_row=sr,curr_col=sc,curr_val=Number.parseInt(document.getElementById(curr_row+'_'+curr_col).textContent);

    document.getElementById(curr_row+'_'+curr_col).classList.add('path'); 
    let path = setInterval(()=> {
        if(curr_val==0) clearInterval(path);
        document.getElementsByClassName('path')[0].classList.remove('path');
        for(let i=0;i<4;i++) {
            let x=dx[i]+curr_row;
            let y=dy[i]+curr_col;
            
            if(x>=0 && y>=0 && x<rows && y<cols && Number.parseInt(document.getElementById(x+'_'+y).textContent)==curr_val-1) {

                curr_val--;
                curr_row=x;
                curr_col=y;
                document.getElementById(curr_row+'_'+curr_col).classList.add('path');
                break;

            }
        }
        
    },300);
}





function change_state(e,r,c,final_state) {
    e.target.classList.remove(...Object.values(states));
    
    visited[r][c]=false;
    
    if(final_state===0) {
        
    }else if(final_state===1) {
        visited[r][c]=true;
    }else if(final_state===2) {

        if(sr!=-1) document.getElementById(sr+'_'+sc).classList.remove("source");
        sr=r;
        sc=c;
        
    }else if(final_state===3) {

        if(tr!=-1) document.getElementById(tr+'_'+tc).classList.remove("target");
        tr=r;
        tc=c;
        
    }
    e.target.classList.add(states[final_state]);
}

function generate_grid() {
    if(rows==-1) {
        alert("OOPS! You Forgot to Create Grid");
        return ;
    } 
    if(sr==-1) {
        alert('OOPS! You Forgot to Select Source');
        return;
    }
    if(tr==-1) {
        alert('OOPS! You Forgot to Select Target');
        return;
    }
    
    queue=[[tr,tc]];
    visited[tr][tc]=true;
    let level=0;
    while(queue.length!==0) {
        let neigh=[];
        let st=queue.length;
        while(st--) {
            let temp=queue.pop();
            let x,y;
            document.getElementById(temp[0]+'_'+temp[1]).innerHTML=`<p style="font-size:${cell_size/5}px;"><i>${level}</i></p>`;
            for(let i=0;i<4;i++) {
                x=temp[0]+dx[i];
                y=temp[1]+dy[i];
                if(x>=0 && y>=0 && x<rows && y<cols && !visited[x][y]) {
                    neigh.push([x,y]);
                    visited[x][y]=true;
                }
            }
        }
        queue=neigh;
        level++;
    }
    is_grid_generated=true;
}


function assign_color(e) {
    
    let eleId=e.target.id;
    let temp=eleId.split("_");
    let r=Number.parseInt(temp[0]),c=Number.parseInt(temp[1]);
    
    // console.log(r,c);
    let curr_state,final_state;
    let cl=e.target.classList;

    if(cl.contains("blocked")) {
        curr_state=1;
    }else if(cl.contains("source")) {
        curr_state=2;
        sr=-1;
        sc=-1;
    }else if(cl.contains("target")) {
        curr_state=3;
        tr=-1;
        tc=-1;

    }else {
        curr_state=0;
    }
    final_state=(curr_state+e.detail)%4;

    change_state(e,r,c,final_state);
    
    // console.log("Source:",sr,sc);
    // console.log("Target:",tr,tc);
    
}

function create_grid() {

    let gridSection=document.getElementById("grid-section");
    let oldMatrix=document.getElementById("matrix-grid");
    let newMatrix=document.createElement('div');
    rows=document.getElementById("row-no").value;
    cols=document.getElementById("col-no").value;


    visited=new Array(rows);

    cell_size =Math.min(window.innerWidth/cols,(window.innerHeight-100)/rows);

    let cell_id;
    
    for(let i=0;i<rows;i++) {
        
        visited[i]=new Array(cols);
        let row_ele=document.createElement('div');
        row_ele.classList.add('row-wrap')

        for(let j=0;j<cols;j++) {

            visited[i][j]=false;

            cell_id=`${i}_${j}`;
            let col_ele=document.createElement('div');
            col_ele.id=cell_id;
            row_ele.appendChild(col_ele);
            col_ele.classList.add('cell');
            col_ele.style.width=cell_size;
            col_ele.style.height=cell_size;
            if(j==0) {
                col_ele.style.borderLeft="1px solid rgba(0,0,0,0.5)";
            }
            if(i==rows-1) {
                col_ele.style.borderBottom="1px solid rgba(0,0,0,0.5)";
            }
            col_ele.addEventListener('click',assign_color);
        }
        newMatrix.appendChild(row_ele);
    }
    gridSection.replaceChild(newMatrix,oldMatrix);
    newMatrix.id="matrix-grid";

}