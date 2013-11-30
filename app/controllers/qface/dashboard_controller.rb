class Qface::DashboardController < ApplicationController
	layout false
	def home
		if current_user
			render :json => {:login => true, :username => current_user.username}
		else
			render :json => {:login => false}
		end
	end

	def desktop


	end

end
