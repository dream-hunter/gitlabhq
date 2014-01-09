function appImgOver(obj){
	obj.style.opacity=1;
}

function appImgOut(obj){
	obj.style.opacity=0;
}

/* jd jQuery slider example */
/*
$("#slide").Jslider({
    data: pageConfig.DATA_ESlide,
    defaultIndex: 0,
    slideWidth: 578,
    slideHeight: 276,
    slideDirection: 1,
    speed: "normal",
    stay: 5000,
    delay: 150,
    auto: true,
    maxAmount: 8,
    template: {
        itemsWrap: '<div class="slide-itemswrap"><ul class="slide-items">{innerHTML}</ul></div>',
        itemsContent: '{for item in json}<div><a href="${item.href}" target="_blank"><img src="${item.src}" width="${item.width}" height="${item.height}" alt="${item.alt}" data-img="2"></a></div>		{/for}',
        controlsWrap: '<div class="slide-crystal"></div><div class="slide-controls">{innerHTML}</div>',
        controlsContent: '{for item in json}<span class="{if parseInt(item_index)==0}curr{/if}">${parseInt(item_index)+1}</span>{/for}'
    }
});
*/



