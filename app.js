/*
 * FluidDB government metadata search'o'meter
 *
 * (c) 2010 Fluidinfo Inc. http://fluidinfo.com
 *
 * Uses the awesome Sammy javascript framework: http://code.quirkey.com/sammy/
 */
(function($) {
    var app = $.sammy(function() {
        /**********************************************************************
         *
         * UI Helper functions
         *
         *********************************************************************/

        /*
         * Displays the results of a search of FluidDB
         */
        function search_results(data, context){
            // cache the jQuery object
            var $search_results = $('#search_results');
            // empty the element
            $('#loading').hide();
            $search_results.hide();
            $search_results.empty();
            // add the results
            $search_results.append('<h2>Results</h2>');
            if (data.ids.length>0) {
                $search_results.append('<ul class="paging"></ul>');
                pager = $('ul.paging');
                for(item in data.ids) {
                    object_id = data.ids[item];
                    display_item(object_id, pager);
                }
            } else {
                $search_results.append('<div>None found. Please try again...</div>');
            }
            page_size = 10;
            if (data.ids.length>200) {
                page_size = data.ids.length/20;
            }
            pager.quickPager({pageSize: page_size, pagerLocation: "both"});
            $search_results.fadeIn();
        }

        function display_item(object_id, pager){
            pager.append('<li>'+object_id+'</li>');
        }

        /**********************************************************************
         *
         * Routes
         *
         *********************************************************************/
        
        /*
         * Search FluidDB using the query language described here:
         *
         * http://doc.fluidinfo.com/fluidDB/queries.html
         *
         */
        this.post('#/search', function(context) {
            var search_term = context['params']['search'];
            sr = $('#search_results');
            sr.hide();
            // Basic validation
            if (search_term.length > 0) {
                try {
                    $('#loading').show();
                    fluidDB.get('objects?query='+escape(search_term), function(data){search_results(data, context);}, true);
                }
                catch (err) {
                    $('#loading').hide();
                    sr.show();
                    $('#search_results').append('<h3>There was a problem with your search :-(<h3><p>Please try again...</p>');
                }
            } else {
            // oops...
                alert('You must enter something to search for...');
            }
        });

        /*
         * Search FluidDB with a GET request made using the query language
         * referenced above.
         */
        this.get(/\#\/(.*)$/, function(context) {
            var search_term = this.params["splat"][0];
                try {
                    // update the UI and get the search request from FluidDB
                    $('#loading').show();
                    $("#search_box").val(search_term.replace("%20"," "));
                    fluidDB.get('objects?query='+search_term, function(data){search_results(data, context);}, true);
                }
                catch (err) {
                    $('#loading').hide();
                    $('#search_results').append('<h3>There was a problem with your search :-(<h3><p>Please try again...</p>');
                }
        });
    });

    $(function() {
        app.run();
    });
})(jQuery);
