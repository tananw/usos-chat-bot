from radish import after, world


@after.each_scenario()
def cleanup(scenario):
    """ Kill flask app process """
    world.config.user_data['process'].kill()
    world.config.user_data['process'].communicate()
