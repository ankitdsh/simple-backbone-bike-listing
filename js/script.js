$(function() {

    // Getting the City From Search Params
    var CITY = location.search.split('city=')[1] ? (location.search.split('city=')[1]).toLowerCase() : 'bangalore';

    // Setting the City as Page Header
    $('#city').text(CITY.toUpperCase());

    //Various List of Cities Available
    var CONFIG = {
        URL: {
            bangalore: "data/bangalore.json",
            mumbai: "data/mumbai.json",
            delhi: "data/delhi.json",
            pune: "data/pune.json",
        }
    };


    //FETCHING DATA From Local File due to CORS
    $.ajax({
        url: CONFIG.URL[CITY],
        dataType: "json",
        success: function(res) {
            var BIKES = res.results;


            // Define a model for a bike
            var Bike = Backbone.Model.extend({

                // These are their default values
                defaults: {
                    bike_name: "N.A",
                    cc: 0,
                    image: [],
                    bike_model: "N.A",
                    year_of_mfg: "N.A",
                    available_slots: {
                        slot_values: [],
                        slot_content: []
                    },
                    city: "N.A",
                    grab_deal: false,
                    total_rating: "N.A",
                    smart_save_price: "N.A",
                    warranty_provided: "N.A",
                    discounted_price: "N.A",
                    location: "N.A",
                    rsa_provided: "N.A",
                    mileage: "N.A",
                    is_shortlisted: "N.A",
                    display_price: "N.A",
                    bike_type: "N.A",
                    km_driven: "N.A",
                    bike_make: "N.A",
                    bike_variant: "N.A",
                    is_blocked: "N.A",
                    is_reserved: "N.A",
                    max_price: "N.A",
                    bike_id: undefined,
                    can_be_booked_for_test_drive: false,
                    displayed: false
                },

                initialize: function() {
                    console.log('A Bike is created !!');
                }
            });

            // Define a collection of Bikes
            var BikeList = Backbone.Collection.extend({
                model: Bike
            });

            // Creating a collection of Bikes
            var Bikes = new BikeList((function() {

                var bike_list = [];

                _.forEach(BIKES, function(bike) {
                    //ADDING EACH BIKE MODEL TO A COLLECTION
                    bike_list.push(new Bike(bike));
                });

                return bike_list;

            })());

            // view for bike
            var BikeView = Backbone.View.extend({
                tagName: 'div',
                events: {
                    'click': 'showBikeDetails'
                },
                initialize: function() {
                    this.listenTo(this.model, 'change', this.render);
                },
                render: function() {

                    var model = this.model.toJSON();

                    // Compile the template using underscore
                    var template = (_.template($("#bike_template").html()))(model);


                    this.$el.html(template);

                    // Create the HTML
                    // this.$el.html(   '<input type="checkbox" value="1" name="' + this.model.get('title') + '" /> ' + this.model.get('title') + '<span>$' + this.model.get('price') + '</span>');
                    // this.$el.html('<div>' +
                    //     //'<div><img src=' + this.model.get('image')[0] + '>' + this.model.get('bike_name') + ' ' + this.model.get('cc') + '' + this.model.get('year_of_mfg') + '</div>' +
                    //     '<div>CITY:-' + this.model.get('city') + ' Rating:- ' + this.model.get('total_rating') + 'Milaege:-' + this.model.get('mileage') + '</div>' +
                    //     '<div>CITY:-' + this.model.get('city') + ' Rating:- ' + this.model.get('total_rating') + 'Milaege:-' + this.model.get('mileage') + '</div>' +
                    //     '</div>');
                    // this.$('input').prop('checked', this.model.get('checked'));

                    // Returning the object is a good practice
                    // that makes chaining possible
                    return this;
                },
                showBikeDetails: function() {
                    var bike = this.model.toJSON();
                    console.debug('You clicked on:');
                    console.log(bike);

                    $('#bikeDetailLink')[0].href = "http://www.credr.com/search/details/?bike_id=" + bike.bike_id;
                    $("#myModal").modal('show');
                }
            });

            // The main view of the application
            var App = Backbone.View.extend({

                initialize: function() {

                    this.list = $('#bikeList');


                    // creating view for each bike and appending to '#bikeList'
                    Bikes.each(function(bike) {

                        var view = new BikeView({
                            model: bike
                        });
                        this.list.append(view.render().el);

                    }, this);
                }
            });

            new App();
        },
        error: function() {
            console.log('Error: Fetching Data');
        }
    });
});
