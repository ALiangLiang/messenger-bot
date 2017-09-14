const 按鈕種類 = {
    網址: (參數) => {
        const
            必要參數 = ['標題', '網址'],
            非必要參數 = [{
                名稱: 'webview長寬比',
                合理參數: ['緊密', '高度優先', '填滿']
            }, 'messenger擴充', '回呼網址', 'webview分享按鈕'];
        new 偵錯(參數, 必要參數, 非必要參數);
        return {
            type: 'web_url',
            url: 參數.網址,
            title: 參數.標題,
            webview_height_ratio: 參數.webview長寬比,
            messenger_extensions: 參數.messenger擴充,
            fallback_url: 參數.回呼網址,
            webview_share_button: 參數.webview分享按鈕
        };
    },
    回傳: (參數) => {
        const 必要參數 = ['標題', '回答'];
        new 偵錯(參數, 必要參數);
        return {
            type: 'postback',
            payload: 參數.回答,
            title: 參數.標題
        };
    },
    分享: (參數) => {
        const 非必要參數 = ['分享內容'];
        new 偵錯(參數, void 0, 非必要參數);
        return {
            type: 'element_share',
            share_contents: 參數.分享內容
        };
    },
    打電話: (參數) => {
        const 必要參數 = ['標題', '電話號碼'];
        new 偵錯(參數, 必要參數);
        return {
            type: 'phone_number',
            payload: 參數.電話號碼,
            title: 參數.標題
        };
    },
};

const 模板種類 = {
    一般: (參數) => {
        const 必要參數 = ['標題'];
        new 偵錯(參數, 必要參數);
        if (參數 instanceof Object)
            參數 = [參數];
        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: 參數.map((一個參數) => {
                        return {
                            title: 一個參數.標題,
                            subtitle: 一個參數.子標題,
                            image_url: 一個參數.圖片網址,
                            default_action: 一個參數.預設動作,
                            buttons: 一個參數.材料
                        };
                    })
                }
            }
        };
    },
    按鈕: (參數) => {
        const 必要參數 = ['內容', '按鈕'];
        new 偵錯(參數, 必要參數);
        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: 參數.內容,
                    buttons: 參數.按鈕
                }
            }
        };
    }
};

class 偵錯 {

    constructor(參數, 必要參數 = [], 非必要參數 = []) {
        this.參數 = 參數;
        this.檢查必要參數(必要參數);
        this.檢查非必要參數(非必要參數);
    }

    檢查必要參數(必要參數) {
        必要參數.forEach((名稱) => {
            if (!this.參數[名稱])
                console.error(`缺少參數「${名稱}」。`);
        });
    }

    檢查非必要參數(非必要參數陣列) {
        /* 檢查每一種非必要參數 */
        非必要參數陣列.forEach((非必要參數) => {
            /* 若有合理參數限制 */
            if (非必要參數.合理參數)
            /* 參數值不在合理參數限制內 */
                if (!非必要參數.合理參數.find((合理參數) => this.參數[非必要參數.名稱] === 合理參數))
                console.error(`「${非必要參數.名稱}」的參數值錯誤。`);
        });
    }

}

module.exports = {
            按鈕: class 按鈕 {
                constructor(種類, 參數) {
                    return 按鈕種類[種類](參數);
                }
            },
            模板: class 模板 {
                constructor(種類, 參數) {
                    return 模板種類[種類](參數);
                }
            },
            快速回覆: class 快速回覆 {
                constructor(參數) {
                    const 必要參數 = ['標題'];
                    new 偵錯(參數, 必要參數);
                    return {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'generic',
                                elements: 參數.map((一個參數) => {
                                    return {
                                        title: 一個參數.標題,
                                        subtitle: 一個參數.子標題,
                                        image_url: 一個參數.圖片網址,
                                        default_action: 一個參數.預設動作,
                                        buttons: 一個參數.材料
                                    };
                                })
                            }
                        }
                    };
                }
            }
        };