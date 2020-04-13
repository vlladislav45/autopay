$(document).ready(function(){
    changeSelectedSetting();
});

function changeSelectedSetting() {
    $(document).on('click', '.checkbox', function(){
        let target = $(this);

        if(target.attr('class').split(" ")[1] === 'disabled') {
            target.removeClass('disabled').toggleClass('enabled');
            target.css('transform', 'scale(0.9)');
            target.css('background', '#fff');

           let info = target.children('.info');
           info.children('.is-enabled').text('Enabled');
        }else {
            target.removeClass('enabled').toggleClass('disabled');
            target.css('transform', 'scale(1)');
            target.css('background', '#e1e6ee');

            let info = target.children('.info');
            info.children('.is-enabled').text('Disabled');
        }
    });
}