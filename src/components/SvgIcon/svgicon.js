import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default {
    install: (app) => {
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            console.log("组件配置的信息为key的值为:[%s] 组件的对象为:[%o]", key, component);
            app.component(key, component)
        }
    },
};
