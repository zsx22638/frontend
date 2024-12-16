import { ElMessage } from 'element-plus';
import 'element-plus/theme-chalk/el-message.css';

const message = {
    success(msg) {
        ElMessage.success(msg);
    },
    error(msg) {
        ElMessage.error(msg);
    },
    warning(msg) {
        ElMessage.warning(msg);
    },
    info(msg) {
        ElMessage.info(msg);
    },
};

export default message;
