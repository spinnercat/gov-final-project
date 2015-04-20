class PersonController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def create
    person = Person.new
    person.name = params['name']
    person.email = params['email']
    person.treatment = params['treatment']
    person.valuation = params['valuation']
    person.save!

    render json: { success: true, id: person.id }
  rescue StandardError => e
    render json: { success: false }
  end

  def update_valuation
    Person.find(params['id']).add_valuation!(params['valuation'])

    render json: { success: true }
  rescue StandardError => e
    render json: { success: false }
  end
end