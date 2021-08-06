$(document).ready(function () {
    let url = "https://restcountries.eu/rest/v2/all";
    getData(url)
    const input = $('#keyword');
    input.keypress(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (input.val() != "") {
                getDataByName(input.val())
            } else {
                let url = "https://restcountries.eu/rest/v2/all";
                getData(url)
            }
        }
    })
    // const url_location = location.hash;
    // openDetailPage(url_location)
});
$(window).on('hashchange', function () {
    const url_location = location.hash;
    openDetailPage(url_location.split('#')[1]);
    $('.page-main').addClass('d-none');
    $('.detail').removeClass('d-none');
});

$('.select').click(function () {
    $('.selectbox ul').toggleClass('visible')
});

$('.region-item').click(function (e) {
    const rel = $(this).attr('rel');
    $('.select span').html(rel);
    getDataByRegion(rel)
});

function getDataByName(keyword) {
    let url = "https://restcountries.eu/rest/v2/name/" + keyword;
    getData(url)
}

function getDataByRegion(keyword) {
    let url = "https://restcountries.eu/rest/v2/region/" + keyword;
    getData(url)
}

// function getDataByHash(keyword) {
//     let url = "https://restcountries.eu/rest/v2/name/" + keyword;
//     getDetailData(url)
// }

function getData(url) {
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        // data: data,
        success: function (res) {
            let results = "";
            res.forEach(function (data) {
                results += '<div class="item-country mb-5">\n' +
                    '                    <a href="' + data.alpha3Code.toLowerCase() + '.html" class="country">\n' +
                    '                    <div class="item-flag">\n' +
                    '                        <img class="img-fluid" src="' + data.flag + '" alt="">\n' +
                    '                    </div>\n' +
                    '                    <div class="item-information">\n' +
                    '                        <div class="name">' + data.name + '</div>\n' +
                    '                        <div class="populations">Population: ' + data.population + '</div>\n' +
                    '                        <div class="region">Region: ' + data.region + '</div>\n' +
                    '                        <div class="capital">Capital: ' + data.capital + '</div>\n' +
                    '                    </div>\n' +
                    '                </a>' +
                    '                </div>'
            });
            $('.countries-results').html(results)
        }, error: function (res) {

            $('.countries-results').html("<div class=\"alert alert-danger\" role=\"alert\">\n" +
                "  No Results !" +
                "</div>")
        }
    });
}

// function getDetailData(url) {
//     $.ajax({
//         url: url,
//         method: 'GET',
//         dataType: 'json',
//         // data: data,
//         success: function (res) {
//             let results = "";
//             let v_languages = "";
//             let borders = "";
//             res[0].languages.forEach(function (data) {
//                 v_languages += data.name + ', '
//             })
//             res[0].borders.forEach(function (data) {
//                 borders += '<div class="back-button keyword">' + data + ' </div>';
//             })
//             $('.section-detail').html(' <div class="col-md-6">\n' +
//                 '                <img class="img-fluid" src="' + res[0].flag + '" alt="">\n' +
//                 '            </div>\n' +
//                 '            <div class="col-md-6 d-flex align-items-center">\n' +
//                 '           <div class="row">' +
//                 '           <div class="col-12 mt-4 mt-md-auto">' + '  <div class="name mb-4">' + res[0].name + '</div>\n' +
//                 '            </div>' +
//                 '           <div class="col-md-6">' +
//                 '                <div class="feature-item">Native Name: ' + res[0].nativeName + '</div>\n' +
//                 '                <div class="feature-item">Population: ' + res[0].population + '</div>\n' +
//                 '                <div class="feature-item">Region: ' + res[0].region + '</div>\n' +
//                 '                <div class="feature-item">Subregion: ' + res[0].subregion + '</div>\n' +
//                 '                <div class="feature-item">Capital: ' + res[0].capital + '</div>\n' +
//                 '            </div>' +
//                 '           <div class="col-md-6 mt-4 mt-md-0">' +
//                 '                <div class="feature-item">Top Level Domain: ' + res[0].topLevelDomain[0] + '</div>\n' +
//                 '                <div class="feature-item">Currencies: ' + res[0].currencies[0].name + '</div>\n' +
//                 '                <div class="feature-item">Languages:  ' + v_languages + '</div>\n' +
//                 '            </div>' +
//                 '           <div class="col-12 mt-5">Border Countries: ' + borders +
//                 '            </div>' +
//                 '            </div>' +
//                 '            </div>')
//         }, error: function (res) {
//
//         }
//     });
// }
//
// function openDetailPage(url_location) {
//     getDataByHash(url_location)
// }
