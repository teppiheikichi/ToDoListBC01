import { Task } from '../models/task.js';
import { TaskService } from '../services/TaskService.js';


//Khai báo đối tượng service
const taskSV = new TaskService();

const getAllTask = async () => {
    try {
        //Bước 2:
        //dùng service để gọi api từ backend lấy dữ liệu về
        const result = await taskSV.getAllTask();
        console.log('result', result.data)
        //Bước 3: Từ dữ liệu lấy về tách ra 2 mảng => render dữ liệu lên giao diện
        //task todo 
        let taskToDo = result.data.filter(task => task.status === false);
        //Gọi hàm hiển thị dữ liệu lên giao diện
        renderTaskToDo(taskToDo);
        //task done
        let taskCompleted = result.data.filter(task => task.status === true);
        //Gọi hàm hiển thị dữ liệu lên giao diện
        renderTaskDone(taskCompleted)
    } catch (err) {
        //Lỗi trong hàm try sẽ trả về biến err của catch
    }

}

const renderTaskToDo = (taskToDo) => {
    const contentTaskToDo = taskToDo.reduce((content, item, index) => {
        content += `<li>
            <span style="cursor:pointer">${item.taskName}</span>
            <span style="cursor:pointer" onclick="delTask('${item.taskName}')">
                <i class="fa fa-trash"></i>
            </span>
            <span style="cursor:pointer">
                <i class="fa fa-check"></i>
            </span>
        </li>`;
        return content;
    }, '')
    //Dom đến giao diện hiển thị các li vào innerHTML của ul
    document.getElementById('todo').innerHTML = contentTaskToDo;
}
const renderTaskDone = (taskDone) => {
    const contentTaskToDo = taskDone.reduce((content, item, index) => {
        content += `<li>
            <span style="cursor:pointer">${item.taskName}</span>
            <span style="cursor:pointer" onclick="delTask('${item.taskName}')">
                <i class="fa fa-trash"></i>
            </span style="cursor:pointer">
            <span style="cursor:pointer">
                <i class="fa fa-check"></i>
            </span>
        </li>`;
        return content;
    }, '');
    document.getElementById('completed').innerHTML = contentTaskToDo;
}

//Định nghĩa sự kiện cho nút xoá
window.delTask = async (taskName) => {

    let cfm = confirm('Bạn có muốn xoá task ?');
    if (cfm) {
        //Gọi api mỗi lần người dùng bấm nút xoá dữ liệu
        try {
            let result = await taskSV.deleteTask(taskName);
            console.log(result.data);
            //Gọi lại hàm get task sau khi xoá
            getAllTask();

        } catch (err) {
            console.log(err);
        }
    }

}





//B1: Định nghĩa và gọi hàm getAllTask
getAllTask();



// ================== Nghiệp vụ thêm task =================
//B1 : Định nghĩa sự kiện click cho button#addItem
document.getElementById('addItem').onclick = async (event) => {
    // event.preventDefault(); //Chặn sự kiện hiện tại của thẻ submit hay thẻ href thẻ a
    //event.target <= đại diện cho thẻ button đang được onclick

    //Lấy thông tin người dùng nhập từ giao diện
    let taskName = document.getElementById('newTask').value;
    //Tạo ra object backend yêu cầu
    const taskModel = new Task();
    taskModel.taskName = taskName;
    //Gọi api đưa dữ liệu về server
    try {
        let result = await taskSV.addTask(taskModel);
        console.log('kết quả thêm task', result.data)
        //Sau khi thêm thành công gọi api getAllTask từ hàm đã viết sẵn
        getAllTask();
    } catch (err) {
        console.log(err);
    }
}

// =========================Nghiệp vụ xoá dữ liệu===================


