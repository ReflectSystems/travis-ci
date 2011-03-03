class RepositoriesController < ApplicationController
  respond_to :json

  def index
    respond_with(repositories)
  end

  def show
    respond_to do |format|
      format.json { respond_with(repository) }
      format.png do
        status = Repository.human_status_by_name("#{params[:user]}/#{params[:name]}")
        send_file(Rails.public_path + "/images/status/#{status}.png", :type => 'image/png', :disposition => 'inline')
      end
    end
  end

  protected
    def repositories
      if params[:username] && user = User.find_by_username(params[:username])
        user.repositories.timeline
      else
        Repository.timeline.recent
      end
    end

    def repository
      @repository ||= params[:id] ? Repository.find(params[:id]) : nil
    end
    helper_method :repository
end
