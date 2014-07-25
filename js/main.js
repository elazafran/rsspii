

//EDIT THESE LINES
//Title of the blog
var TITLE = "Palma del rio Informacion Ultimas noticias";
//RSS url
var RSS = "http://javieraliaga.info/info/feed/";
//Stores entries
var entries = [];
var selectedEntry = "";

//listen for detail links
$(".contentLink").live("click", function() {
	selectedEntry = $(this).data("entryid");
});

function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");
}

//Listen for Google's library to load
function initialize() {
	console.log('ready to use google');
	var feed = new google.feeds.Feed(RSS);
	feed.setNumEntries(20);
	$.mobile.showPageLoadingMsg();
	feed.load(function(result) {
		$.mobile.hidePageLoadingMsg();
		if(!result.error) {
			entries = result.feed.entries;
			localStorage["entries"] = JSON.stringify(entries);
			renderEntries(entries);

            console.log(    result.feed.entries);
		} else {
			console.log("Error - "+result.error.message);
			if(localStorage["entries"]) {

				$("#status").html("Using cached version...");
				entries = JSON.parse(localStorage["entries"]);
                renderEntries(entries);
			} else {
				$("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
            }
		}
	});
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
	//Set the title
	$("h1", this).text(TITLE);
	
	google.load("feeds", "1",{callback:initialize});
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
	//Set the title
    $("img").each(function (index) {
                     $(this).addClass("maxwidth");
                }
    );

	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].content;
    contentHTML += entries[selectedEntry].publishedDate;
    // propiedades objeto
    /*
     console.log(    result.feed.entries);
    author
    categories
        ["Cultura", "Eventos", "Última hora"]
    content
    contentSnippet
    link
    publishedDate
    title
     */
	contentHTML += '<p/><a href="'+entries[selectedEntry].link + '" class="fullLink" data-role="button">Leer toda la noticia</a>';
   	$("#entryText",this).html(contentHTML);
    $("#entryText .fullLink",this).button();


});
	
$(window).on("touchstart", ".fullLink", function(e) {
	e.preventDefault();
	window.plugins.childBrowser.showWebPage($(this).attr("href"));
});

